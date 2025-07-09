const sanitize = require("sanitize-html");
const ResponseHelper = require("../helpers/ResponseHelper");
const Package = require("../models/packageModel");
const Transaction = require("../models/transactionModel");
const sanitizeHtml = require("sanitize-html");
const UserSubscription = require("../models/userSubscriptionModel");
const CreditCardDetails = require("../models/creditCardModels");
const CompanySignUpDetails = require("../models/company_sign_up_details");
const Companies = require("../models/companiesModel");
const StripePackage = require("../models/stripePackageModel");
const Employees = require("../models/employeeModel");
const Departments = require("../models/departmentsModel");
const CompanyPackageDetails = require("../models/companyPackageDetailsModel");
const { Op, Sequelize } = require("sequelize");
// const stripe = Stripe(process.env.STRIPE_WEBHOOK_SECRET_KEY);
const moment = require("moment");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { log } = require("console");
const RazorPaySubscription = require("../models/razorPaySubscriptionModel");
const RazorpayTransaction = require("../models/razorpayTransaction");
const { sequelize } = require("../config/db.config");
const RazorPayCreditCardDetails = require("../models/razorPayCreditCardDetails");
const RazorPaySubscriptionAndPackageMap = require("../models/razorPaySubscriptionAndPackageMapModel");
const PackageDetails = require("../models/packageDetailsModel");
const stripe = require("stripe")(process.env.STRIPE_WEBHOOK_SECRET_KEY);
const razorpay = new Razorpay({
    // key_id: process.env.RAZORPAY_KEY_ID,
    key_id: "rzp_live_LfL256kGXh6CLC",
    // key_secret: process.env.RAZORPAY_KEY_SECRET,
    key_secret: "2tjSbicg9V6WU8kw5MyF3k7g",
});

module.exports.createCustomer = async (req, res) => {
    try {
        let { email } = req.body;
        email = sanitizeHtml(email);

        const customerDetails = await CompanySignUpDetails.findOne({
            where: { company_admin_email: email },
        });

        const customer = await stripe.customers.create({
            name: customerDetails?.company_name,
            email: email,
            address: {
                line1: "123 Main St",
                line2: "Apt 4B",
                city: "New York",
                state: "NY",
                postal_code: "10001",
                country: "US",
            },
        });

        return ResponseHelper.OK(res, true, "Customer created successfully!", customer, null, "Create Customer API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Create Customer API");
    }
};
module.exports.createProduct = async (req, res) => {
    try {
        let { package_id } = req.params;
        package_id = sanitizeHtml(parseInt(package_id));
        let packageDetails = await Package.findOne({
            where: {
                id: package_id,
            },
        });
        const product = await stripe.products.create({
            name: packageDetails?.package_name,
            description: `Subscription plan for ${packageDetails?.package_name}`,
        });
        const price = await stripe.prices.create({
            unit_amount: packageDetails?.package_price * 100,
            currency: "INR",
            recurring: { interval: "month" },
            product: product.id,
        });

        const newPackage = await StripePackage.create({
            stripe_package_name: packageDetails?.package_name,
            stripe_package_price: packageDetails?.package_price,
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            validity_in_days: packageDetails?.validity_in_days,
            user_base: packageDetails?.user_base,
            is_stripe_package_enabled: 1,
        });

        return ResponseHelper.Created(res, true, "Product Created Successfully!", newPackage, null, "Create Product API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Create Product API");
    }
};

module.exports.createSubscription = async (req, res) => {
    try {
        const { company_id, package_id, stripe_package_id, paymentMethod } = req.body;
        const sanitizedCompanyId = sanitizeHtml(parseInt(company_id));
        const sanitizedPackageId = sanitizeHtml(package_id);
        const sanitizedStripePackageId = sanitizeHtml(stripe_package_id);

        const packageData = await Package.findOne({ where: { id: sanitizedPackageId } });
        const companyData = await Companies.findOne({ where: { id: sanitizedCompanyId } });
        const companySignUpData = await CompanySignUpDetails.findOne({ where: { id: companyData?.companies_sign_up_details_id } });

        let customer = await stripe.customers.list({ email: companySignUpData?.company_admin_email });
        customer = customer.data.length ? customer.data[0] : null;

        const attachedPaymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: customer.id,
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: packageData?.package_price * 100,
            currency: "inr",
            customer: customer?.id,
            payment_method: attachedPaymentMethod.id,
            description: "Subscription payment",
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        });

        const stripePackageData = await StripePackage.findOne({
            where: { id: sanitizedStripePackageId },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer?.id,
            items: [{ price: stripePackageData.stripe_price_id }],
            trial_period_days: 30,
            metadata: {
                company_id: sanitizedCompanyId,
                package_id: sanitizedPackageId,
                package_name: packageData?.package_name,
                package_price: packageData?.package_price,
                validity_in_days: packageData?.validity_in_days,
                start_time: new Date(),
                end_time: new Date(new Date().setDate(new Date().getDate() + packageData?.validity_in_days)),
                next_payment_date: new Date(new Date().setDate(new Date().getDate() + packageData?.validity_in_days)),
            },
            payment_behavior: "allow_incomplete",
            expand: ["latest_invoice.payment_intent"],
            default_payment_method: attachedPaymentMethod.id,
        });

        const paymentIntentStatus = paymentIntent.status;

        if (paymentIntentStatus === "requires_action" || paymentIntentStatus === "requires_source_action") {
            const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);

            if (confirmedPaymentIntent.status === "succeeded") {
                return await ResponseHelper.OK(
                    res,
                    true,
                    "Subscription created and payment successful!",
                    { subscriptionId: subscription.id, paymentIntentStatus: paymentIntentStatus },
                    null,
                    "Create Subscription API"
                );
            } else {
                return await ResponseHelper.ISError(res, "Payment failed after action required. Please try again.", "Create Subscription API");
            }
        } else if (paymentIntentStatus === "succeeded") {
            const companyDetails = await Companies.findOne({
                where: {
                    id: sanitizedCompanyId,
                },
            });

            if (companyDetails?.payment_status == 0) {
                await Companies.update({ payment_status: 1 }, { where: { id: sanitizedCompanyId } });
            }

            const companySignUpData = await CompanySignUpDetails.findOne({
                where: {
                    id: companyDetails?.companies_sign_up_details_id,
                },
            });

            const departmentDetails = await Departments.findOne({
                where: {
                    company_id: sanitizedCompanyId,
                },
            });

            let companyData = {
                company_id: sanitizedCompanyId,
                role_id: 2,
                firstname: companyDetails?.name,
                email: companySignUpData?.company_admin_email,
                password: companySignUpData?.company_admin_password,
                department_id: departmentDetails?.id,
                picture: companyDetails?.picture,
                language_id: 1,
                middlename: "",
                lastname: "",
                phone_prefix: "",
                phone: "",
                gender: "male",
            };

            await Employees.create(companyData);

            return await ResponseHelper.OK(
                res,
                true,
                "Subscription created and payment successful!",
                { subscriptionId: subscription.id, paymentIntentStatus: paymentIntentStatus },
                null,
                "Create Subscription API"
            );
        } else if (paymentIntentStatus === "requires_payment_method") {
            return await ResponseHelper.ISError(res, "Payment failed. Please try a different payment method.", "Create Subscription API");
        }
        return await ResponseHelper.OK(
            res,
            true,
            "Subscription created successfully but payment not completed.",
            { subscriptionId: subscription.id, paymentIntentStatus: paymentIntentStatus },
            null,
            "Create Subscription API"
        );
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Create Subscription API");
    }
};

module.exports.autoPayment = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    console.log("Hellllooooooooo!!!!!!");

    let event;
    const endpointSecret = process.env.STRIPE_ENDPOINT_KEY;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        let packageId;

        if (event.type === "invoice.payment_action_required") {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            const subscription = await stripe.subscriptions.retrieve(subscriptionIendpointSecretd);
            packageId = subscription.items.data[0]?.package_id || null;
            const response = await Transaction.create({
                package_id: packageId,
                stripe_subscription_id: subscriptionId,
                payment_status: 1,
            });

            return ResponseHelper.OK(res, true, "Payment is pending. User needs to take action.", response, null, "Webhook Auto Payment API");
        }

        if (event.type == "invoice.payment_succeeded") {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            if (!subscriptionId) {
                return ResponseHelper.ISError(res, "Subscription ID not found in webhook event", "Webhook Auto Payment API");
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const packageId = subscription.metadata?.package_id || null;
            const company_id = subscription.metadata?.company_id || null;

            const existingTransaction = await Transaction.findOne({
                where: {
                    payment_method_id: subscription.default_payment_method,
                },
            });

            if (existingTransaction) {
                return ResponseHelper.ISError(res, "Duplicate transaction detected. This payment has already been processed.", "Webhook Auto Payment API");
            }

            const newTransaction = await Transaction.create({
                package_id: packageId,
                stripe_subscription_id: subscriptionId,
                payment_status: 2,
                company_id: company_id,
                payment_method_id: subscription.default_payment_method,
            });

            const package_name = subscription.metadata?.package_name || null;
            const package_price = subscription.metadata?.package_price || null;
            const validity_in_days = subscription.metadata?.validity_in_days || null;
            const start_date = subscription.metadata?.start_time ? new Date(parseInt(subscription.metadata.start_time) * 1000).toISOString().slice(0, 19).replace("T", " ") : null;

            const end_date = subscription.metadata?.end_time ? new Date(parseInt(subscription.metadata.end_time) * 1000).toISOString().slice(0, 19).replace("T", " ") : null;

            const next_payment_date = subscription.metadata?.next_payment_date ? new Date(parseInt(subscription.metadata.next_payment_date) * 1000).toISOString().slice(0, 19).replace("T", " ") : null;

            const [userSubscription, created] = await UserSubscription.findOrCreate({
                where: { stripe_subsciption_id: subscriptionId },
                defaults: {
                    company_id,
                    package_id: packageId,
                    package_name,
                    package_price,
                    validity_in_days,
                    start_date,
                    end_date,
                    stripe_subsciption_id: subscriptionId,
                    next_payment_date,
                    payment_method_id: subscription.default_payment_method,
                },
            });

            if (created) {
                await userSubscription.update({
                    next_payment_date: new Date(new Date().setDate(new Date().getDate() + parseInt(validity_in_days))),
                    end_date: new Date(new Date().setDate(new Date().getDate() + parseInt(validity_in_days))),
                });
            }

            return { newTransaction, userSubscription };
        }

        if (event.type === "invoice.payment_failed") {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;

            const response = await Transaction.update({ payment_status: 3 }, { where: { stripe_subscription_id: subscriptionId } });

            return ResponseHelper.OK(res, false, "Payment failed. Subscription not updated.", response, null, "Webhook Auto Payment API");
        }

        return ResponseHelper.OK(res, true, "Event received but not handled!", null, null, "Webhook Auto Payment API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Webhook Auto Payment API");
    }
};

module.exports.storeCreditCardDetails = async (req, res) => {
    try {
        let { company_id, package_id, paymentMethodId, cardHolder, expiryDate, card_number, card_type } = req.body;

        cardHolder = sanitizeHtml(cardHolder);
        expiryDate = sanitizeHtml(expiryDate);
        paymentMethodId = sanitizeHtml(paymentMethodId);
        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);
        card_number = sanitizeHtml(card_number);
        card_type = sanitizeHtml(card_type);

        if (!paymentMethodId || !cardHolder || !expiryDate || !card_number || !card_type) {
            return ResponseHelper.BadRequest(res, "Invalid card details", "Store Credit Card Details API");
        }

        const data = {
            card_holder: cardHolder,
            expiry_date: expiryDate,
            payment_method_id: paymentMethodId,
            package_id: package_id,
            company_id: company_id,
            card_number: card_number,
            card_type: card_type,
        };

        await CreditCardDetails.create(data);

        return ResponseHelper.Created(res, true, "Credit Card Details Added Successfully!", null, null, "Store Credit Card Details API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Store Credit Card Details API");
    }
};

module.exports.getPaymentDetails = async (req, res) => {
    try {
        let { company_id } = req.query;
        company_id = sanitizeHtml(company_id);
        if (!company_id) {
            return await ResponseHelper.NotFound(res, false, "Details not found!", null, null, "Get Payment Details API");
        }

        const mappedData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: {
                company_id: company_id,
            },
            order: [["created_at", "DESC"]],
        });

        const transactionDetails = await RazorpayTransaction.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const creditCardData = await RazorPayCreditCardDetails.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const subscriptionData = await RazorPaySubscription.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const paymentData = {
            transactionDetails,
            creditCardData,
            subscriptionData,
        };

        if (paymentData) {
            return ResponseHelper.OK(res, true, "Payment Details Fetched Successfully!", paymentData, null, "Get Payment Details API");
        }
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Payment Details API");
    }
};

module.exports.getPaymentDetailsForTransaction = async (req, res) => {
    try {
        let { company_id } = req.query;
        company_id = sanitizeHtml(company_id);
        if (!company_id) {
            return await ResponseHelper.NotFound(res, false, "Details not found!", null, null, "Get Payment Details API");
        }
        const mappedData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: {
                company_id: company_id,
            },
            order: [["created_at", "DESC"]],
        });

        const transactionDetails = await RazorpayTransaction.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const creditCardData = await RazorPayCreditCardDetails.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const subscriptionData = await RazorPaySubscription.findOne({
            where: {
                subscription_id: mappedData?.subscription_id,
            },
        });

        const paymentData = {
            transactionDetails,
            creditCardData,
            subscriptionData,
        };

        if (paymentData) {
            return ResponseHelper.OK(res, true, "Payment Details Fetched Successfully!", paymentData, null, "Get Payment Details API");
        }
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Payment Details API");
    }
};

// module.exports.getCompanyTransactionHistory = async (req, res) => {
//     try {
//         let { company_id } = req.query;
//         const query = req.query;
//         const page = query.page ? parseInt(query.page) : 1;
//         const limit = query.limit ? parseInt(query.limit) : 10;
//         const offset = (page - 1) * limit;
//         const searchTerm = req.query.search ? req.query.search.trim() : null;
//         const startDate = req.query.start_date;
//         const endDate = req.query.end_date;

//         if (!company_id) {
//             return ResponseHelper.BadRequest(res, "Company ID is required.", "Transaction List API");
//         }
//         let creditCardWhere = {};
//         let packageWhere = {};
//         let transactionWhere = { company_id };

//         let searchWhere = { company_id };
//         if (searchTerm) {
//             creditCardWhere[Op.or] = [{ payment_method_id: { [Op.like]: `%${searchTerm}%` } }, { card_holder: { [Op.like]: `%${searchTerm}%` } }, { card_type: { [Op.like]: `%${searchTerm}%` } }];

//             packageWhere.package_name = { [Op.like]: `%${searchTerm}%` };

//             transactionWhere[Op.or] = [
//                 { stripe_subscription_id: { [Op.like]: `%${searchTerm}%` } },
//                 { payment_status: { [Op.like]: `%${searchTerm}%` } },
//                 { created_at: { [Op.like]: `%${searchTerm}%` } },
//             ];
//         }

//         if (startDate && endDate) {
//             transactionWhere.created_at = {
//                 [Op.between]: [moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss"), moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")],
//             };
//         }

//         const creditCardData = await CreditCardDetails.findAll({
//             offset,
//             limit,
//             where: searchWhere,
//         });

//         const { count: transactionCount, rows: transactionData } = await Transaction.findAndCountAll({
//             where: transactionWhere,
//             offset,
//             limit,
//         });

//         const companyDetails = await CompanyPackageDetails.findAll({
//             where: { company_id },
//         });

//         const packageIds = companyDetails.map((detail) => detail.package_id);

//         const packageDetails = await Package.findAll({
//             where: {
//                 id: packageIds,
//             },
//         });

//         const totalPages = Math.ceil(transactionCount / limit);
//         const hasNextPage = page < totalPages;
//         const hasPrevPage = page > 1;
//         const meta = {
//             totalCount: transactionCount,
//             pageCount: totalPages,
//             currentPage: page,
//             perPage: limit,
//             hasNextPage,
//             hasPrevPage,
//         };

//         return ResponseHelper.OK(res, true, "Transaction List Fetched Successfully!", { creditCardData, transactionData, packageDetails }, meta, "Transaction List API");
//     } catch (error) {
//         return ResponseHelper.ISError(res, error.message, "Transaction List API");
//     }
// };

module.exports.getCompanyTransactionHistory = async (req, res) => {
    try {
        let { company_id } = req.query;
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search ? req.query.search.trim() : null;
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;

        if (!company_id) {
            return ResponseHelper.BadRequest(res, "Company ID is required.", "Transaction List API");
        }
        let creditCardWhere = {};
        let packageWhere = {};
        // let transactionWhere = { company_id };

        const mappedData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: {
                company_id: company_id,
            },
        });

        let subscription_id = mappedData?.subscription_id;

        // let searchWhere = { company_id };
        let searchWhere = { subscription_id };
        let transactionWhere = { subscription_id };

        if (searchTerm) {
            creditCardWhere[Op.or] = [
                { card_network: { [Op.like]: `%${searchTerm}%` } },
                // Optional: only include if searchable last 4 digits
                { card_number: { [Op.like]: `%${searchTerm}%` } },
            ];

            packageWhere[Op.or] = [
                { package_name: { [Op.like]: `%${searchTerm}%` } },
                Sequelize.where(Sequelize.cast(Sequelize.col("package_price"), "CHAR"), {
                    [Op.like]: `%${searchTerm}%`,
                }),
            ];

            // Try parsing if it's a date
            const date = new Date(searchTerm);
            if (!isNaN(date)) {
                const isoDate = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
                transactionWhere[Op.or] = [{ created_at: { [Op.like]: `%${isoDate}%` } }];
            }
        }

        if (startDate && endDate) {
            transactionWhere.created_at = {
                [Op.between]: [moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss"), moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")],
            };
        }

        const creditCardData = await RazorPayCreditCardDetails.findAll({
            offset,
            limit,
            where: {
                subscription_id,
                ...creditCardWhere,
            },
        });

        const { count: transactionCount, rows: transactionData } = await RazorpayTransaction.findAndCountAll({
            where: transactionWhere,
            offset,
            limit,
        });

        const companyDetails = await CompanyPackageDetails.findAll({
            where: { company_id },
        });

        const packageIds = companyDetails.map((detail) => detail.package_id);

        const packageDetails = await Package.findAll({
            where: {
                id: packageIds,
                ...packageWhere,
            },
        });

        const totalPages = Math.ceil(transactionCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const meta = {
            totalCount: transactionCount,
            pageCount: totalPages,
            currentPage: page,
            perPage: limit,
            hasNextPage,
            hasPrevPage,
        };

        return ResponseHelper.OK(res, true, "Transaction List Fetched Successfully!", { creditCardData, transactionData, packageDetails, mappedData }, meta, "Transaction List API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Transaction List API");
    }
};
// module.exports.razorPayPayment = async (req, res) => {
//     try {
//         const { email, interval, amount, trial_days, item, company_id, package_id } = req.body;
//         const sanitizedCompanyId = sanitizeHtml(parseInt(company_id));
//         const sanitizedPackageId = sanitizeHtml(parseInt(package_id));

//         const period = interval === "monthly" ? "monthly" : interval === "weekly" ? "weekly" : "monthly";

//         const plan = await razorpay.plans.create({
//             period: period,
//             interval: 1, // 1 month/1 week based on the user's choice
//             item: {
//                 name: item.name,
//                 amount: amount * 100, // Convert to paise
//                 currency: "INR",
//                 description: item.description || "No description",
//             },
//         });

//         let existingCustomer = await razorpay.customers.all({ email: email });
//         let customer;
//         let customerDetails;

//         if (existingCustomer.items.length > 0) {
//             customer = existingCustomer.items[0];
//         } else {
//             customerDetails = await CompanySignUpDetails.findOne({
//                 where: { company_admin_email: email },
//             });

//             customer = await razorpay.customers.create({
//                 name: customerDetails?.company_name || "Unknown User",
//                 email: customerDetails?.company_admin_email || email,
//                 notes: { description: "Subscription Customer" },
//             });
//         }

//         const trialStartDate = Math.floor(Date.now() / 1000);
//         const trialEndDate = trialStartDate + trial_days * 24 * 60 * 60;

//         const subscription = await razorpay.subscriptions.create({
//             plan_id: plan.id,
//             customer_id: customer.id,
//             start_at: trialEndDate, // Subscription starts after the trial period
//             customer_notify: 1,
//             total_count: 12, // Monthly subscription
//         });

//         // // Step 5: Create Subscription (start after trial)
//         // const subscription = await razorpay.subscriptions.create({
//         //     plan_id: plan.id,
//         //     customer_id: customer.id,
//         //     start_at: trialEndDate, // Subscription starts after the trial period
//         //     customer_notify: 1,
//         //     total_count: 12, // Monthly subscription
//         // });

//         console.log("HELLLLLLLLLL1111111111111111111111111111");
//         if (subscription) {
//             const companyDetails = await Companies.findOne({
//                 where: {
//                     id: sanitizedCompanyId,
//                 },
//             });

//             console.log("HELLLLLLLLLL111222222222222222222221111111111111");

//             if (companyDetails?.payment_status == 0) {
//                 await Companies.update({ payment_status: 1 }, { where: { id: sanitizedCompanyId } });
//             }

//             const companySignUpData = await CompanySignUpDetails.findOne({
//                 where: {
//                     id: companyDetails?.companies_sign_up_details_id,
//                 },
//             });

//             const departmentDetails = await Departments.findOne({
//                 where: {
//                     company_id: sanitizedCompanyId,
//                 },
//             });

//             console.log("HELLLLLLLLLL111222333333333333333333333333222221111111111111");

//             let companyData = {
//                 company_id: sanitizedCompanyId,
//                 role_id: 2,
//                 firstname: companyDetails?.name,
//                 email: companySignUpData?.company_admin_email,
//                 password: companySignUpData?.company_admin_password,
//                 department_id: departmentDetails?.id,
//                 picture: companyDetails?.picture,
//                 language_id: 1,
//                 middlename: "",
//                 lastname: "",
//                 phone_prefix: "",
//                 phone: "",
//                 gender: "male",
//             };

//             console.log("DATAAAAAAAAAAAAAAAAAAAAA", companyData);

//             await Employees.create(companyData);
//         }
//         console.log("HELLLLLLLLLL1112223333334444444444445555555555555555555544444444444333333333333333333222221111111111111");

//         const mappedData = {
//             package_id: sanitizedPackageId,
//             company_id: sanitizedCompanyId,
//             subscription_id: subscription?.id,
//         };
//         console.log("HELLLLLLLLLL11122233333344444444444444444444444333333333333333333222221111111111111");

//         await RazorPaySubscriptionAndPackageMap.create(mappedData);

//         return ResponseHelper.OK(
//             res,
//             true,
//             "Subscription Created Successfully! Payment will be charged after trial period.",
//             {
//                 subscriptionId: subscription.id,
//                 authLink: subscription.short_url, // ✅ Razorpay returns short_url in subscription response
//                 customerId: customer.id,
//                 amount: amount,
//                 description: item?.description,
//             },
//             null,
//             "RazorPay Payment API"
//         );
//     } catch (error) {
//         console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", error);
//         return ResponseHelper.ISError(res, error.message, "Razor Pay Payment API");
//     }
// };

module.exports.razorPayPayment = async (req, res) => {
    try {
        const { email, interval, amount, trial_days, item, company_id, package_id } = req.body;
        const sanitizedCompanyId = sanitizeHtml(parseInt(company_id));
        const sanitizedPackageId = sanitizeHtml(parseInt(package_id));

        console.log("razorpay", razorpay.key_id, razorpay.key_secret);

        const period = interval === "monthly" ? "monthly" : interval === "weekly" ? "weekly" : "monthly";

        const plan = await razorpay.plans.create({
            period: period,
            interval: 1,
            item: {
                name: item.name,
                amount: amount * 100,
                currency: "INR",
                description: item.description || "No description",
            },
        });

        let existingCustomer = await razorpay.customers.all({ email: email });
        let customer;
        let customerDetails;

        console.log("HElllllllllllllllllllllllllllL!!!!!!!!!!!!!!!");

        if (existingCustomer.items.length > 0) {
            customer = existingCustomer.items[0];
        } else {
            customerDetails = await CompanySignUpDetails.findOne({
                where: { company_admin_email: email },
            });

            customer = await razorpay.customers.create({
                name: customerDetails?.company_name || "Unknown User",
                email: customerDetails?.company_admin_email || email,
                notes: { description: "Subscription Customer" },
            });
        }

        const trialStartDate = Math.floor(Date.now() / 1000);
        const trialEndDate = trialStartDate + trial_days * 24 * 60 * 60;

        const subscription = await razorpay.subscriptions.create({
            plan_id: plan.id,
            customer_id: customer.id,
            start_at: trialEndDate,
            customer_notify: 1,
            total_count: 60,
        });

        if (subscription) {
            const companyDetails = await Companies.findOne({
                where: {
                    id: sanitizedCompanyId,
                },
            });

            const companySignUpData = await CompanySignUpDetails.findOne({
                where: {
                    id: companyDetails?.companies_sign_up_details_id,
                },
            });

            const departmentDetails = await Departments.findOne({
                where: {
                    company_id: sanitizedCompanyId,
                },
            });

            const companyData = {
                company_id: sanitizedCompanyId,
                role_id: 2,
                firstname: companyDetails?.name,
                email: companySignUpData?.company_admin_email,
                password: companySignUpData?.company_admin_password,
                department_id: departmentDetails?.id,
                picture: companyDetails?.picture,
                language_id: 1,
                middlename: "",
                lastname: "",
                phone_prefix: "",
                phone: "",
                gender: "male",
            };

            const existingEmployee = await Employees.findOne({
                where: { email: companyData.email },
            });

            if (!existingEmployee) {
                await Employees.create(companyData);
            } else {
                console.log("Employee already exists, skipping create.");
            }
        }

        const packageData = await PackageDetails.findOne({
            where: {
                package_id: sanitizedPackageId,
            },
        });

        console.log("HEER!!!!!!!!!1");

        const mappedData = {
            package_id: sanitizedPackageId,
            company_id: sanitizedCompanyId,
            subscription_id: subscription?.id,
            is_camera_visible: packageData?.is_camera_visible,
            is_id_proof_visible: packageData?.is_id_proof_visible,
            is_wifi_checkbox_visible: packageData?.is_wifi_checkbox_visible,
            is_car_parking_visible: packageData?.is_car_parking_visible,
            is_display_visitor_card_visible: packageData?.is_display_visitor_card_visible,
            is_print_visitor_card_visible: packageData?.is_print_visitor_card_visible,
            is_data_export_available: packageData?.is_data_export_available,
            is_digital_log_visible: packageData?.is_digital_log_visible,
            is_report_export_available: packageData?.is_report_export_available,
        };

        await RazorPaySubscriptionAndPackageMap.create(mappedData);

        return ResponseHelper.OK(
            res,
            true,
            "Subscription Created Successfully! Payment will be charged after trial period.",
            {
                subscriptionId: subscription.id,
                authLink: subscription.short_url,
                customerId: customer.id,
                amount: amount,
                description: item?.description,
            },
            null,
            "RazorPay Payment API"
        );
    } catch (error) {
        console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", error);
        return ResponseHelper.ISError(res, error.message, "Razor Pay Payment API");
    }
};

module.exports.razorPayWebhook = async (req, res) => {
    console.log("WEBHOOK GOT HIT!!!!!!!!>>>>>>>>>>>>>>>>>>>");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body;

    try {
        const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

        if (expectedSignature !== signature) {
            return ResponseHelper.BadRequest(res, "Invalid Webhook Signature", "Razor Pay Webhook API!");
        }

        const event = JSON.parse(rawBody.toString("utf8"));
        const eventType = event?.event?.trim().toLowerCase();

        const transaction = await sequelize.transaction();

        const createdAt = new Date(event?.payload?.subscription?.entity?.created_at * 1000);
        const nextPaymentDate = new Date(createdAt);
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

        const mappedData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: { subscription_id: event?.payload?.subscription?.entity?.id },
        });

        const packageData = await Package.findOne({
            where: { id: mappedData?.package_id },
        });

        if (eventType === "subscription.authenticated") {
            await RazorPaySubscription.create(
                {
                    plan_id: event?.payload?.subscription?.entity?.plan_id,
                    subscription_id: event?.payload?.subscription?.entity?.id,
                    customer_id: event?.payload?.subscription?.entity?.customer_id,
                    subscription_status_id: 1,
                    package_id: mappedData?.package_id,
                    company_id: mappedData?.company_id,
                    package_name: packageData?.package_name,
                    package_price: packageData?.package_price,
                    validity_in_days: packageData?.validity_in_days,
                    user_base: packageData?.user_base,
                    next_payment_date: nextPaymentDate,
                    subscription_type: 3,
                },
                { transaction }
            );
            const companyDetails = await Companies.findOne({
                where: {
                    id: mappedData?.company_id,
                },
            });
            if (companyDetails?.payment_status == 0) {
                await Companies.update({ payment_status: 1 }, { where: { id: mappedData?.company_id } });
            }
        } else if (eventType === "subscription.activated") {
            await RazorPaySubscription.update({ subscription_status_id: 2 }, { where: { subscription_id: event?.payload?.subscription?.entity?.id }, transaction });

            await RazorpayTransaction.create(
                {
                    subscription_id: event?.payload?.subscription?.entity?.id,
                    plan_id: event?.payload?.subscription?.entity?.plan_id,
                    customer_id: event?.payload?.subscription?.entity?.customer_id,
                    amount: event?.payload?.payment?.entity?.amount,
                    payment_method: event?.payload?.payment?.entity?.method,
                    order_id: event?.payload?.payment?.entity?.order_id,
                    transaction_id: event?.payload?.payment?.entity?.id,
                    payment_status: 2,
                },
                { transaction }
            );
        } else if (eventType === "subscription.charged") {
            let subscriptionExists = await RazorPaySubscription.findOne({
                where: { subscription_id: event?.payload?.subscription?.entity?.id },
                transaction,
            });

            const currentDate = new Date();

            if (!subscriptionExists) {
                console.log("Subscription not found. Creating new subscription...");

                const createdAt = new Date(event?.payload?.subscription?.entity?.created_at * 1000);
                const nextPaymentDate = new Date(createdAt);
                nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

                subscriptionExists = await RazorPaySubscription.create(
                    {
                        subscription_id: event?.payload?.subscription?.entity?.id,
                        customer_id: event?.payload?.subscription?.entity?.customer_id,
                        plan_id: event?.payload?.subscription?.entity?.plan_id,
                        subscription_status_id: 2,
                        package_id: mappedData?.package_id,
                        company_id: mappedData?.company_id,
                        package_name: packageData?.package_name,
                        package_price: packageData?.package_price,
                        validity_in_days: packageData?.validity_in_days,
                        user_base: packageData?.user_base,
                        next_payment_date: nextPaymentDate,
                        subscription_type: 3,
                    },
                    { transaction }
                );
            } else {
                const currentNextPayment = subscriptionExists.next_payment_date || currentDate;
                const newNextPaymentDate = new Date(currentNextPayment);
                newNextPaymentDate.setDate(newNextPaymentDate.getDate() + 30);

                await subscriptionExists.update(
                    {
                        subscription_status_id: 3,
                        next_payment_date: newNextPaymentDate,
                    },
                    { transaction }
                );
            }

            const transactionExists = await RazorpayTransaction.findOne({
                where: { subscription_id: event?.payload?.subscription?.entity?.id },
                transaction,
            });

            if (!transactionExists) {
                await RazorpayTransaction.create(
                    {
                        subscription_id: event?.payload?.subscription?.entity?.id,
                        plan_id: event?.payload?.subscription?.entity?.plan_id,
                        customer_id: event?.payload?.subscription?.entity?.customer_id,
                        amount: event?.payload?.payment?.entity?.amount,
                        payment_method: event?.payload?.payment?.entity?.method,
                        order_id: event?.payload?.payment?.entity?.order_id,
                        transaction_id: event?.payload?.payment?.entity?.id,
                        payment_status: 2,
                    },
                    { transaction }
                );
            } else {
                await RazorpayTransaction.update(
                    {
                        customer_id: event?.payload?.subscription?.entity?.customer_id,
                        amount: event?.payload?.payment?.entity?.amount,
                        payment_method: event?.payload?.payment?.entity?.method,
                        order_id: event?.payload?.payment?.entity?.order_id,
                        transaction_id: event?.payload?.payment?.entity?.id,
                        payment_status: 2,
                    },
                    {
                        where: { subscription_id: event?.payload?.subscription?.entity?.id },
                        transaction,
                    }
                );
            }

            await RazorPayCreditCardDetails.create(
                {
                    subscription_id: event?.payload?.subscription?.entity?.id,
                    customer_id: event?.payload?.subscription?.entity?.customer_id,
                    plan_id: event?.payload?.subscription?.entity?.plan_id,
                    card_id: event?.payload?.payment?.entity?.card_id,
                    card_number: event?.payload?.payment?.entity?.card?.number,
                    card_network: event?.payload?.payment?.entity?.card?.network,
                    card_color: event?.payload?.payment?.entity?.card?.color,
                },
                { transaction }
            );
        } else if (eventType === "subscription.pending") {
            await RazorPaySubscription.update({ subscription_status_id: 4 }, { where: { subscription_id: event?.payload?.subscription?.entity?.id }, transaction });
        } else if (eventType === "subscription.completed") {
            await RazorPaySubscription.update({ subscription_status_id: 5, next_payment_date: null }, { where: { subscription_id: event?.payload?.subscription?.entity?.id }, transaction });
        } else {
            throw new Error(`Unhandled Event: ${event.event}`);
        }

        await transaction.commit();

        return ResponseHelper.OK(res, true, "Webhook processed successfully!", null, null, "Razor Pay Webhook API");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Razor Pay Webhook API");
    }
};
