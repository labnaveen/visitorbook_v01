const ResponseHelper = require("../helpers/ResponseHelper");
const Constants = require("../constants/Constants");
const sanitizeHtml = require("sanitize-html");
const Package = require("../models/packageModel");
const { sequelize } = require("../config/db.config");
const PackageDetails = require("../models/packageDetailsModel");
const { where, Op } = require("sequelize");
const Employees = require("../models/employeeModel");
const Companies = require("../models/companiesModel");
const Departments = require("../models/departmentsModel");
const CompanySignUpDetails = require("../models/company_sign_up_details");
const CompanyPackageDetails = require("../models/companyPackageDetailsModel");
const bcrypt = require("bcrypt");
const CommonHelper = require("../helpers/CommonHelper");
const OrganizationType = require("../models/organizationTypeModel");
const UserSubscription = require("../models/userSubscriptionModel");
const Visitors = require("../models/visiitorModel");
const ContactUs = require("../models/contactUsModel");
const RazorPaySubscriptionAndPackageMap = require("../models/razorPaySubscriptionAndPackageMapModel");
const RazorPaySubscription = require("../models/razorPaySubscriptionModel");
const RazorpayTransaction = require("../models/razorpayTransaction");

module.exports.addPackage = async (req, res) => {
    let {
        package_name,
        package_price,
        validity_in_days,
        is_camera_visible,
        is_id_proof_visible,
        is_wifi_checkbox_visible,
        is_car_parking_visible,
        is_display_visitor_card_visible,
        is_print_visitor_card_visible,
        is_data_export_available,
        is_digital_log_visible,
        is_report_export_available,
        user_base,
    } = req.body;
    try {
        package_name = sanitizeHtml(package_name);
        package_price = sanitizeHtml(package_price);
        validity_in_days = sanitizeHtml(validity_in_days);
        user_base = sanitizeHtml(user_base);

        const isPackageExists = await Package.findOne({
            where: {
                package_name: package_name,
            },
        });

        if (isPackageExists) {
            return await ResponseHelper.Conflict(res, "There is already a package with this name!", null, "Add Package API.");
        }

        await sequelize.transaction(async (t) => {
            const packageData = {
                package_name: package_name,
                package_price: package_price,
                validity_in_days: validity_in_days,
                user_base: user_base,
            };
            const packageDetails = await Package.create(packageData, { transaction: t });

            if (packageDetails.id) {
                const packageDetailsData = {
                    package_id: packageDetails.id,
                    is_camera_visible: !!is_camera_visible,
                    is_id_proof_visible: !!is_id_proof_visible,
                    is_wifi_checkbox_visible: !!is_wifi_checkbox_visible,
                    is_car_parking_visible: !!is_car_parking_visible,
                    is_display_visitor_card_visible: !!is_display_visitor_card_visible,
                    is_print_visitor_card_visible: !!is_print_visitor_card_visible,
                    is_data_export_available: !!is_data_export_available,
                    is_digital_log_visible: !!is_digital_log_visible,
                    is_report_export_available: !!is_report_export_available,
                };

                await PackageDetails.create(packageDetailsData, { transaction: t });
            }
        });

        return await ResponseHelper.Created(res, true, "Package Added Successfully!", null, null, "Add Package API.");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Add Package API!");
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        const { package_name, package_price, currency, billing_cycle } = req.body;

        // Validate inputs
        if (!package_name || !package_price || !currency || !billing_cycle) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Step 1: Create Product in Stripe
        const product = await stripe.products.create({
            name: package_name,
            description: `Subscription plan for ${package_name}`,
        });

        // Step 2: Create Price in Stripe
        const price = await stripe.prices.create({
            unit_amount: package_price * 100, // Convert to cents (Stripe uses smallest currency unit)
            currency: currency,
            recurring: { interval: billing_cycle }, // Options: "month", "year"
            product: product.id,
        });

        // Step 3: Store product & price in the database
        const newPackage = await Package.create({
            package_name,
            package_price,
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            currency,
            billing_cycle,
        });

        // Step 4: Return Response
        return res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product: {
                package_name,
                package_price,
                currency,
                billing_cycle,
                stripe_product_id: product.id,
                stripe_price_id: price.id,
            },
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.editPackageDetails = async (req, res) => {
    let {
        package_id,
        package_name,
        package_price,
        validity_in_days,
        is_camera_visible,
        is_id_proof_visible,
        is_wifi_checkbox_visible,
        is_car_parking_visible,
        is_display_visitor_card_visible,
        is_print_visitor_card_visible,
        is_data_export_available,
        is_digital_log_visible,
        is_report_export_available,
        user_base,
    } = req.body;

    try {
        const isPackageExists = await Package.findOne({
            where: {
                id: package_id,
            },
        });

        if (!isPackageExists) {
            return await ResponseHelper.NotFound(res, false, "Package not found!", null, null, "Edit Package API");
        } else {
            const updatePackageDetails = {
                package_name: package_name,
                package_price: package_price,
                validity_in_days: validity_in_days,
                user_base: user_base,
            };

            await Package.update(updatePackageDetails, { where: { id: package_id } });

            const updatePackageFunctionality = {
                is_camera_visible: !!is_camera_visible,
                is_id_proof_visible: !!is_id_proof_visible,
                is_wifi_checkbox_visible: !!is_wifi_checkbox_visible,
                is_car_parking_visible: !!is_car_parking_visible,
                is_display_visitor_card_visible: !!is_display_visitor_card_visible,
                is_print_visitor_card_visible: !!is_print_visitor_card_visible,
                is_data_export_available: !!is_data_export_available,
                is_digital_log_visible: !!is_digital_log_visible,
                is_report_export_available: !!is_report_export_available,
            };
            const doesPackageDetailsExist = await PackageDetails.findOne({
                where: {
                    package_id: isPackageExists.id,
                },
                paranoid: false,
            });
            if (doesPackageDetailsExist) {
                await PackageDetails.update(updatePackageFunctionality, { where: { package_id: isPackageExists.id }, paranoid: false });
            }
        }
        return await ResponseHelper.OK(res, true, "Package Details updated successfully!", null, null, "Edit Package API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Edit Package API");
    }
};

module.exports.deletePackage = async (req, res) => {
    let { package_id } = req.params;

    try {
        package_id = parseInt(package_id);
        const searchedPackage = await Package.findOne({
            where: { id: package_id },
            paranoid: false,
        });
        if (!searchedPackage) {
            return await ResponseHelper.NotFound(res, false, "Package not found!", null, null, "Delete Package API");
        }

        await Package.destroy({ where: { id: package_id } });

        const searchedPackageDetails = await PackageDetails.findOne({
            where: { package_id: package_id },
            paranoid: false,
        });
        if (searchedPackageDetails) {
            await PackageDetails.update({ deleted_at: new Date() }, { where: { package_id: package_id } });
        }

        return await ResponseHelper.OK(res, true, "Package deleted successfully!", null, null, "Delete Package API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Delete Package API");
    }
};

module.exports.getPackageDetails = async (req, res) => {
    let { package_id } = req.params;
    try {
        let packageData;
        const packageDetails = await Package.findOne({
            where: {
                id: package_id,
            },
        });

        if (packageDetails) {
            packageData = await PackageDetails.findOne({
                where: {
                    package_id: packageDetails.id,
                },
            });
        }
        let response = {
            packageDetails,
            packageData,
        };

        return await ResponseHelper.OK(res, true, "Package details fetched successfully!", response, null, "Delete Package API");
    } catch (error) {
        console.log(error);
        return await ResponseHelper.ISError(res, error.message, "Delete Package API");
    }
};

module.exports.togglePackage = async (req, res) => {
    let { package_id } = req.params;

    try {
        let msg = "";
        let data;
        const findPackage = await Package.findOne({
            where: {
                id: package_id,
            },
        });

        if (findPackage.is_package_enabled == 1) {
            msg = "disabled";
            data = {
                is_package_enabled: 0,
            };
        } else if (findPackage.is_package_enabled == 0) {
            msg = "enabled";
            data = {
                is_package_enabled: 1,
            };
        }
        const updatedData = await Package.update(data, {
            where: {
                id: findPackage.id,
            },
        });
        if (updatedData) {
            return await ResponseHelper.OK(res, true, `Package ${msg} successfully !`, null, null, "Toggle Package API!");
        }
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Toggle Package API");
    }
};

module.exports.getPackageList = async (req, res) => {
    try {
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search ? req.query.search.trim() : null;
        let searchWhere = {};
        if (searchTerm) {
            searchWhere[Op.or] = [{ package_name: { [Op.like]: `%${searchTerm}%` } }, { package_price: { [Op.like]: `%${searchTerm}%` } }, { validity_in_days: { [Op.like]: `%${searchTerm}%` } }];
        }

        const { rows, count } = await Package.findAndCountAll({
            offset,
            limit,
            where: searchWhere,
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const meta = {
            totalCount: count,
            pageCount: totalPages,
            currentPage: page,
            perPage: limit,
            hasNextPage,
            hasPrevPage,
        };
        return await ResponseHelper.OK(res, true, "Packages list fetched succesfully !", rows, meta, "Package List API.");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Package List API");
    }
};

module.exports.getPackagesListForWeb = async (req, res) => {
    try {
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search ? req.query.search.trim() : null;
        let searchWhere = {};
        if (searchTerm) {
            searchWhere[Op.or] = [{ package_name: { [Op.like]: `%${searchTerm}%` } }, { package_price: { [Op.like]: `%${searchTerm}%` } }, { validity_in_days: { [Op.like]: `%${searchTerm}%` } }];
        }

        const { rows, count } = await Package.findAndCountAll({
            offset,
            limit,
            where: searchWhere,
            include: {
                model: PackageDetails,
            },
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const meta = {
            totalCount: count,
            pageCount: totalPages,
            currentPage: page,
            perPage: limit,
            hasNextPage,
            hasPrevPage,
        };
        return await ResponseHelper.OK(res, true, "Packages list fetched succesfully !", rows, meta, "Package List API.");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Package List API");
    }
};

// module.exports.companySignUp = async (req, res) => {
//     try {
//         let { company_name, company_address, company_admin_email, company_admin_password, organization_type, gst_number, package_id } = req.body;

//         company_name = sanitizeHtml(company_name);
//         company_address = sanitizeHtml(company_address);
//         company_admin_email = sanitizeHtml(company_admin_email);
//         company_admin_password = sanitizeHtml(company_admin_password);
//         organization_type = sanitizeHtml(organization_type);
//         gst_number = sanitizeHtml(gst_number);
//         package_id = sanitizeHtml(package_id);

//         let company_logo = req.files?.company_logo?.[0]?.filename || null;
//         let gst_certificate = req.files?.gst_certificate?.[0]?.filename || null;

//         let addCompany;

//         // const isDuplicateCompanyExists = await CompanySignUpDetails.findOne({
//         //     where: { company_admin_email: company_admin_email },
//         // });

//         // if (isDuplicateCompanyExists) {
//         //     return await ResponseHelper.Conflict(res, "Company with same email already exists!", null, "Company Sign Up API!");
//         // }

//         // const isGstNumberExists = await CompanySignUpDetails.findOne({
//         //     where: { gst_number: gst_number },
//         // });

//         // if (isGstNumberExists) {
//         //     return await ResponseHelper.Conflict(res, "GST number already exists!", null, "Company Sign Up API!");
//         // }

//         const hashedCompanyPassword = await bcrypt.hash(company_admin_password, 10);
//         const randomCode = await CommonHelper.generateTempPassword(6);

//         await sequelize.transaction(async (t) => {
//             const companySignUpDetailsData = await CompanySignUpDetails.create(
//                 {
//                     company_name,
//                     company_address,
//                     company_admin_email,
//                     company_admin_password: hashedCompanyPassword,
//                     organization_type,
//                     gst_number,
//                     company_logo,
//                     gst_certificate,
//                     package_id,
//                 },
//                 { transaction: t }
//             );
//             addCompany = await Companies.create(
//                 {
//                     name: company_name,
//                     address: company_address,
//                     picture: company_logo,
//                     code: randomCode,
//                     status: 1,
//                     companies_sign_up_details_id: companySignUpDetailsData?.id,
//                     payment_status: 0,
//                 },
//                 { transaction: t }
//             );

//             await Departments.create(
//                 {
//                     name: "admin",
//                     display_name: "Admin",
//                     color: "#ffffff",
//                     company_id: addCompany?.id,
//                 },
//                 { transaction: t }
//             );

//             const packageDetails = await PackageDetails.findOne({ where: { package_id: package_id } });

//             await CompanyPackageDetails.create(
//                 {
//                     company_id: addCompany?.id,
//                     package_id: packageDetails.package_id,
//                     is_camera_visible: packageDetails.is_camera_visible,
//                     is_id_proof_visible: packageDetails.is_id_proof_visible,
//                     is_wifi_checkbox_visible: packageDetails.is_wifi_checkbox_visible,
//                     is_car_parking_visible: packageDetails.is_car_parking_visible,
//                     is_display_visitor_card_visible: packageDetails.is_display_visitor_card_visible,
//                     is_print_visitor_card_visible: packageDetails.is_print_visitor_card_visible,
//                     is_data_export_available: packageDetails?.is_data_export_available,
//                     is_digital_log_visible: packageDetails?.is_report_export_available,
//                 },
//                 { transaction: t }
//             );

//             await CompanyFeaturesMapModel.create(
//                 {
//                     company_id: addCompany?.id,
//                     package_id: packageDetails.package_id,
//                     is_camera_visible: packageDetails.is_camera_visible,
//                     is_id_proof_visible: packageDetails.is_id_proof_visible,
//                     is_wifi_checkbox_visible: packageDetails.is_wifi_checkbox_visible,
//                     is_car_parking_visible: packageDetails.is_car_parking_visible,
//                     is_display_visitor_card_visible: packageDetails.is_display_visitor_card_visible,
//                     is_print_visitor_card_visible: packageDetails.is_print_visitor_card_visible,
//                     is_data_export_available: packageDetails?.is_data_export_available,
//                     is_digital_log_visible: packageDetails?.is_report_export_available,
//                 },
//                 { transaction: t }
//             );
//         });

//         return await ResponseHelper.Created(res, true, "Company signed up successfully!", addCompany, null, "Company Sign Up API");
//     } catch (error) {
//         console.log("ERRRRRRRRRRRRRRR", error.message);
//         return await ResponseHelper.ISError(res, error.message, "Company Sign Up API");
//     }
// };

// module.exports.companySignUp = async (req, res) => {
//     try {
//         let { company_name, company_address, company_admin_email, company_admin_password, organization_type, gst_number, package_id } = req.body;

//         company_name = sanitizeHtml(company_name);
//         company_address = sanitizeHtml(company_address);
//         company_admin_email = sanitizeHtml(company_admin_email);
//         company_admin_password = sanitizeHtml(company_admin_password);
//         organization_type = sanitizeHtml(organization_type);
//         gst_number = sanitizeHtml(gst_number);
//         package_id = sanitizeHtml(package_id);

//         let company_logo = req.files?.company_logo?.[0]?.filename || null;
//         let gst_certificate = req.files?.gst_certificate?.[0]?.filename || null;

//         const isDuplicateCompanyExists = await CompanySignUpDetails.findOne({
//             where: { company_admin_email },
//         });

//         // If company already exists, just return the email info or some other logic as needed
//         // if (isDuplicateCompanyExists) {
//         //     return await ResponseHelper.OK(res, true, "Company with this email already exists.", { company_admin_email }, null, "Company Sign Up API");
//         // }

//         const isGstNumberExists = await CompanySignUpDetails.findOne({
//             where: { gst_number },
//         });

//         if (isGstNumberExists) {
//             return await ResponseHelper.Conflict(res, "GST number already exists!", null, "Company Sign Up API!");
//         }

//         const hashedCompanyPassword = await bcrypt.hash(company_admin_password, 10);
//         const randomCode = await CommonHelper.generateTempPassword(6);

//         let addCompany;

//         await sequelize.transaction(async (t) => {
//             let companySignUpDetailsData;

//             if (isDuplicateCompanyExists) {
//                 // Use the existing CompanySignUpDetails
//                 company_admin_email = isDuplicateCompanyExists;
//             } else {
//                 // Create new CompanySignUpDetails
//                 companySignUpDetailsData = await CompanySignUpDetails.create(
//                     {
//                         company_name,
//                         company_address,
//                         company_admin_email: company_admin_email,
//                         company_admin_password: hashedCompanyPassword,
//                         organization_type,
//                         gst_number,
//                         company_logo,
//                         gst_certificate,
//                         package_id,
//                     },
//                     { transaction: t }
//                 );
//             }

//             addCompany = await Companies.create(
//                 {
//                     name: company_name,
//                     address: company_address,
//                     picture: company_logo,
//                     code: randomCode,
//                     status: 1,
//                     companies_sign_up_details_id: companySignUpDetailsData?.id,
//                     payment_status: 0,
//                 },
//                 { transaction: t }
//             );

//             await Departments.create(
//                 {
//                     name: "admin",
//                     display_name: "Admin",
//                     color: "#ffffff",
//                     company_id: addCompany?.id,
//                 },
//                 { transaction: t }
//             );

//             const packageDetails = await PackageDetails.findOne({ where: { package_id: package_id } });

//             await CompanyPackageDetails.create(
//                 {
//                     company_id: addCompany?.id,
//                     package_id: packageDetails.package_id,
//                     is_camera_visible: packageDetails.is_camera_visible,
//                     is_id_proof_visible: packageDetails.is_id_proof_visible,
//                     is_wifi_checkbox_visible: packageDetails.is_wifi_checkbox_visible,
//                     is_car_parking_visible: packageDetails.is_car_parking_visible,
//                     is_display_visitor_card_visible: packageDetails.is_display_visitor_card_visible,
//                     is_print_visitor_card_visible: packageDetails.is_print_visitor_card_visible,
//                     is_data_export_available: packageDetails?.is_data_export_available,
//                     is_digital_log_visible: packageDetails?.is_report_export_available,
//                 },
//                 { transaction: t }
//             );
//         });

//         return await ResponseHelper.Created(res, true, "Company signed up successfully!", addCompany, null, "Company Sign Up API");
//     } catch (error) {
//         console.log("ERRRRRRRRRRRRRRR", error.message);
//         return await ResponseHelper.ISError(res, error.message, "Company Sign Up API");
//     }
// };

module.exports.companySignUp = async (req, res) => {
    try {
        let { company_name, company_address, company_admin_email, company_admin_password, organization_type, gst_number, package_id } = req.body;

        // Sanitize inputs
        company_name = sanitizeHtml(company_name);
        company_address = sanitizeHtml(company_address);
        company_admin_email = sanitizeHtml(company_admin_email);
        company_admin_password = sanitizeHtml(company_admin_password);
        organization_type = sanitizeHtml(organization_type);
        gst_number = sanitizeHtml(gst_number);
        package_id = sanitizeHtml(package_id);

        // Optional files
        const company_logo = req.files?.company_logo?.[0]?.filename || null;
        const gst_certificate = req.files?.gst_certificate?.[0]?.filename || null;

        // Generate password and code
        const hashedCompanyPassword = await bcrypt.hash(company_admin_password, 10);
        const randomCode = await CommonHelper.generateTempPassword(6);

        // Check if company already exists
        const existingCompanySignUp = await CompanySignUpDetails.findOne({
            where: {
                [Op.or]: [{ company_admin_email }, { gst_number }],
            },
        });

        // Fetch package details
        const packageDetails = await PackageDetails.findOne({
            where: { package_id },
        });

        if (!packageDetails) {
            return await ResponseHelper.BadRequest(res, "Invalid package selected", "Company Sign Up API");
        }

        let resultCompany;

        await sequelize.transaction(async (t) => {
            if (existingCompanySignUp) {
                // UPDATE flow for CompanySignUpDetails
                await existingCompanySignUp.update(
                    {
                        company_name,
                        company_address,
                        company_admin_email,
                        company_admin_password: hashedCompanyPassword,
                        organization_type,
                        gst_number,
                        company_logo: company_logo || existingCompanySignUp.company_logo,
                        gst_certificate: gst_certificate || existingCompanySignUp.gst_certificate,
                        package_id,
                    },
                    { transaction: t }
                );

                // Update Companies table
                const existingCompany = await Companies.findOne({
                    where: { companies_sign_up_details_id: existingCompanySignUp.id },
                });

                if (existingCompany) {
                    await existingCompany.update(
                        {
                            name: company_name,
                            address: company_address,
                            picture: company_logo || existingCompany.picture,
                            code: existingCompany.code || randomCode,
                            status: 1,
                            payment_status: existingCompany.payment_status ?? 0,
                            package_id: package_id,
                            duration: 12,
                        },
                        { transaction: t }
                    );

                    resultCompany = existingCompany;

                    // UPSERT CompanyPackageDetails
                    const existingCompanyPackage = await CompanyPackageDetails.findOne({
                        where: {
                            company_id: existingCompany.id,
                            package_id: packageDetails.package_id,
                            is_package_valid: 1,
                        },
                        transaction: t,
                    });

                    // await CompanyPackageDetails.update(
                    //     { is_package_valid: 0 },
                    //     {
                    //         where: {
                    //             company_id: existingCompany.id,
                    //         },
                    //         transaction: t,
                    //     }
                    // );

                    const packageData = {
                        company_id: existingCompany.id,
                        package_id: packageDetails.package_id,
                        is_camera_visible: packageDetails.is_camera_visible,
                        is_id_proof_visible: packageDetails.is_id_proof_visible,
                        is_wifi_checkbox_visible: packageDetails.is_wifi_checkbox_visible,
                        is_car_parking_visible: packageDetails.is_car_parking_visible,
                        is_display_visitor_card_visible: packageDetails.is_display_visitor_card_visible,
                        is_print_visitor_card_visible: packageDetails.is_print_visitor_card_visible,
                        is_data_export_available: packageDetails.is_data_export_available,
                        is_digital_log_visible: packageDetails.is_report_export_available,
                    };

                    if (existingCompanyPackage) {
                        await existingCompanyPackage.update(
                            {
                                ...packageData,
                                is_package_valid: 1,
                            },
                            { transaction: t }
                        );
                    } else {
                        await CompanyPackageDetails.create(
                            {
                                ...packageData,
                                is_package_valid: 1,
                            },
                            { transaction: t }
                        );
                    }

                    // Ensure 'admin' department exists
                    const existingDepartment = await Departments.findOne({
                        where: { company_id: existingCompany.id },
                    });

                    if (!existingDepartment) {
                        await Departments.create(
                            {
                                name: "admin",
                                display_name: "Admin",
                                color: "#ffffff",
                                company_id: existingCompany.id,
                            },
                            { transaction: t }
                        );
                    }
                }
            } else {
                // CREATE flow
                const companySignUpDetailsData = await CompanySignUpDetails.create(
                    {
                        company_name,
                        company_address,
                        company_admin_email,
                        company_admin_password: hashedCompanyPassword,
                        organization_type,
                        gst_number,
                        company_logo,
                        gst_certificate,
                        package_id,
                    },
                    { transaction: t }
                );

                const newCompany = await Companies.create(
                    {
                        name: company_name,
                        address: company_address,
                        picture: company_logo,
                        code: randomCode,
                        status: 1,
                        companies_sign_up_details_id: companySignUpDetailsData.id,
                        payment_status: 0,
                        package_id: package_id,
                        duration: 12,
                    },
                    { transaction: t }
                );

                console.log("NEW COMPANY>>>>>>>>>>>>>>>>>>>>>>>>>>", newCompany);

                resultCompany = newCompany;

                await Departments.create(
                    {
                        name: "admin",
                        display_name: "Admin",
                        color: "#ffffff",
                        company_id: newCompany.id,
                    },
                    { transaction: t }
                );

                await CompanyPackageDetails.create(
                    {
                        company_id: newCompany.id,
                        package_id: packageDetails.package_id,
                        is_camera_visible: packageDetails.is_camera_visible,
                        is_id_proof_visible: packageDetails.is_id_proof_visible,
                        is_wifi_checkbox_visible: packageDetails.is_wifi_checkbox_visible,
                        is_car_parking_visible: packageDetails.is_car_parking_visible,
                        is_display_visitor_card_visible: packageDetails.is_display_visitor_card_visible,
                        is_print_visitor_card_visible: packageDetails.is_print_visitor_card_visible,
                        is_data_export_available: packageDetails.is_data_export_available,
                        is_digital_log_visible: packageDetails.is_report_export_available,
                    },
                    { transaction: t }
                );
            }
        });

        return await ResponseHelper.Created(res, true, "Company processed successfully!", resultCompany, null, "Company Sign Up API");
    } catch (error) {
        console.log("ERRRRRRRRRRRRRRR", error.message);
        return await ResponseHelper.ISError(res, error.message, "Company Sign Up API");
    }
};

module.exports.getOrganizationTypeList = async (req, res) => {
    try {
        const response = await OrganizationType.findAll();
        return await ResponseHelper.OK(res, true, "Organization Type List fetched succesfully !", response, null, "Organization Type List API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Organization Type List API");
    }
};

// module.exports.checkCompanyActivePackage = async (req, res) => {
//     try {
//         let { company_id, userEmail } = req.query;
//         company_id = sanitizeHtml(company_id);
//         userEmail = sanitizeHtml(userEmail);

//         const checkData = await UserSubscription.findOne({
//             where: { company_id: company_id },
//         });

//         if (checkData?.is_package_enabled == 0) {
//             const emailData = {
//                 email: userEmail,
//                 subject: "No Active Package",
//                 html_body: `<p>Dear User,</p>
//                             <p>Your company does not have an active package. Please subscribe to continue.</p>
//                             <p>Best Regards,<br>GlocalView Infotech Pvt. Ltd.</p>`,
//             };
//             await CommonHelper.createEmail(emailData);

//             return await ResponseHelper.BadRequest(res, "No active package found.Email has been sent to the user", "Active Package Check API!");
//         } else {
//             const tomorrow = new Date();
//             tomorrow.setDate(tomorrow.getDate() + 1);

//             if (checkData.is_package_enabled === 1 && new Date(checkData.start_date) <= tomorrow && tomorrow <= new Date(checkData.end_date)) {
//                 return await ResponseHelper.OK(res, true, "Active package is present!", null, null, "Active Package Check API");
//             } else {
//                 return await ResponseHelper.BadRequest(res, "Package is not active!", "Active Package Check API!");
//             }
//         }
//     } catch (error) {
//         return await ResponseHelper.ISError(res, error.message, "Active Package Check API");
//     }
// };

module.exports.checkCompanyActivePackage = async (req, res) => {
    try {
        let { company_id, userEmail } = req.query;
        company_id = sanitizeHtml(company_id);
        userEmail = sanitizeHtml(userEmail);

        const companyPackageDetails = await CompanyPackageDetails.findOne({
            where: { company_id },
        });

        if (!companyPackageDetails) {
            return await ResponseHelper.NotFound(res, false, "Company Package Details not found!", null, null, "Company Package Details API");
        }

        const { package_id } = companyPackageDetails;

        // Step 2: Get subscription data using company_id
        const subscriptionData = await RazorPaySubscription.findOne({
            where: { company_id },
        });

        // Step 3: Compare dates and update is_package_valid
        let isPackageValid = 0;
        if (subscriptionData?.next_payment_date) {
            const today = new Date();
            const nextPaymentDate = new Date(subscriptionData.next_payment_date);

            isPackageValid = today <= nextPaymentDate ? 1 : 0;

            // Update value in DB
            await CompanyPackageDetails.update({ is_package_valid: isPackageValid }, { where: { company_id } });

            // Reflect change in memory object
            companyPackageDetails.is_package_valid = isPackageValid;
        }

        if (!isPackageValid) {
            const emailData = {
                email: userEmail,
                subject: "No Active Package",
                html_body: `<p>Dear User,</p>
                            <p>Your company does not have an active package. Please subscribe to continue.</p>
                            <p>Best Regards,<br>GlocalView Infotech Pvt. Ltd.</p>`,
            };
            await CommonHelper.createEmail(emailData);

            return await ResponseHelper.BadRequest(res, "No active package found. Email has been sent to the user.", "Active Package Check API!");
        } else {
            // New simplified check: if today is before next payment date, it's valid
            const today = new Date();
            const nextPaymentDate = new Date(subscriptionData.next_payment_date);

            if (today <= nextPaymentDate) {
                return await ResponseHelper.OK(res, true, "Active package is present!", null, null, "Active Package Check API");
            } else {
                return await ResponseHelper.BadRequest(res, "Package is not active!", "Active Package Check API!");
            }
        }
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Active Package Check API");
    }
};

module.exports.countCheckForVisitors = async (req, res) => {
    try {
        let { company_id, userEmail } = req.query;
        company_id = sanitizeHtml(company_id);
        userEmail = sanitizeHtml(userEmail);

        const packageData = await CompanyPackageDetails.findOne({
            where: { company_id },
        });

        const userBaseData = await Package.findOne({
            where: { id: packageData.package_id },
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { count } = await Visitors.findAndCountAll({
            where: {
                company_id,
                created_at: { [Op.lte]: tomorrow },
            },
        });

        if (count >= userBaseData.user_base) {
            const emailData = {
                email: userEmail,
                subject: "Visitor Limit Exceeded",
                html_body: `<p>Dear Admin,</p>
                            <p>Your company has exceeded the visitor limit of <strong>${userBaseData.user_base}</strong>. 
                            Please upgrade your package to continue.</p>
                            <p>Best Regards,<br>GlocalView Infotech Pvt. Ltd.</p>`,
            };
            await CommonHelper.createEmail(emailData);

            return await ResponseHelper.BadRequest(res, "Visitor limit exceeded. An email notification has been sent.", "Visitor Count Check API");
        }

        return await ResponseHelper.OK(res, true, "Visitor Count within limit!", null, null, "Visitor Count Check API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Visitor Count Check API");
    }
};

module.exports.getFeaturesList = async (req, res) => {
    try {
        let { company_id } = req.params;
        const featuresData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
            },
        });
        return await ResponseHelper.OK(res, true, "Features list fetched successfully!", featuresData, null, "Features List API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Features List API");
    }
};

module.exports.addWifiDetails = async (req, res) => {
    try {
        let { wifi_name, wifi_password, company_id, package_id } = req.body;
        wifi_name = sanitizeHtml(wifi_name);
        wifi_password = sanitizeHtml(wifi_password);
        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);

        const packageData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
                package_id: package_id,
            },
        });

        const addedWifiData = await packageData.update({
            wifi_name: wifi_name,
            wifi_password: wifi_password,
        });

        if (addedWifiData) {
            return await ResponseHelper.OK(res, true, "Wifi Details Added Successfully!", null, null, "Wifi Details API");
        }
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Wifi Details API");
    }
};

// module.exports.getCompanyPackageDetails = async (req, res) => {
//     try {
//         let { company_id } = req.params;

//         if (!company_id) {
//             return await ResponseHelper.NotFound(res, false, "Package Details not found!", null, null, "Company Package Details API");
//         }

//         const companyPackageData = await UserSubscription.findOne({
//             where: {
//                 company_id: company_id,
//             },
//             order: [["created_at", "DESC"]],
//         });

//         if (companyPackageData) {
//             return await ResponseHelper.OK(res, true, "Company Package Details Fetched Successfully!", companyPackageData, null, "Company package Details API");
//         }
//     } catch (error) {
//         return await ResponseHelper.ISError(res, error.message, "Company Package Details API");
//     }
// };

module.exports.getCompanyPackageDetails = async (req, res) => {
    try {
        const { company_id } = req.params;

        if (!company_id) {
            return await ResponseHelper.NotFound(res, false, "Package Details not found!", null, null, "Company Package Details API");
        }

        // Step 1: Get company package details
        const companyPackageDetails = await CompanyPackageDetails.findOne({
            where: { company_id },
        });

        if (!companyPackageDetails) {
            return await ResponseHelper.NotFound(res, false, "Company Package Details not found!", null, null, "Company Package Details API");
        }

        const { package_id } = companyPackageDetails;

        // Step 2: Get subscription data using company_id
        const subscriptionData = await RazorPaySubscription.findOne({
            where: { company_id },
        });

        // Step 3: Compare dates and update is_package_valid
        if (subscriptionData?.next_payment_date) {
            const today = new Date();
            const nextPaymentDate = new Date(subscriptionData.next_payment_date);

            const isPackageValid = today <= nextPaymentDate ? 1 : 0;

            // Update value in DB
            await CompanyPackageDetails.update({ is_package_valid: isPackageValid }, { where: { company_id } });

            // Reflect change in memory object
            companyPackageDetails.is_package_valid = isPackageValid;
        }

        // Step 4: Get package data
        const packageData = await Package.findOne({
            where: { id: package_id },
        });

        // Step 5: Build response
        const result = {
            companyPackageDetails,
            subscriptionData,
            packageData,
        };

        return await ResponseHelper.OK(res, true, "Company Package Details Fetched Successfully!", result, null, "Company Package Details API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Company Package Details API");
    }
};

// module.exports.getCompanyPackageDetails = async (req, res) => {
//     try {
//         let { company_id } = req.params;

//         if (!company_id) {
//             return await ResponseHelper.NotFound(res, false, "Company and Package Details not found!", null, null, "Company Package Details API");
//         }

//         const activePackageData = await CompanyPackageDetails.findOne({
//             where: {
//                 company_id: company_id,
//                 is_package_valid: 1,
//             },
//         });

//         if (!activePackageData) {
//             return await ResponseHelper.NotFound(res, false, "Package Details not found!", null, null, "Company Package Details API");
//         }

//         const packageData = await Package.findOne({
//             where: {
//                 id: activePackageData?.package_id,
//             },
//         });

//         const companyPackageData = {
//             packageData,
//             subscriptionData,
//         };

//         if (companyPackageData) {
//             return await ResponseHelper.OK(res, true, "Company Package Details Fetched Successfully!", companyPackageData, null, "Company package Details API");
//         }
//     } catch (error) {
//         return await ResponseHelper.ISError(res, error.message, "Company Package Details API");
//     }
// };

// module.exports.getCompanyPackageDetailsForTransaction = async (req, res) => {
//     try {
//         let { company_id, paymentId } = req.query;
//         company_id = sanitizeHtml(company_id);
//         paymentId = sanitizeHtml(paymentId);

//         if (!company_id) {
//             return await ResponseHelper.NotFound(res, false, "Package Details not found!", null, null, "Company Package Details API");
//         }

//         const companyPackageData = await UserSubscription.findOne({
//             where: {
//                 company_id: company_id,
//                 payment_method_id: paymentId,
//             },
//             order: [["created_at", "DESC"]],
//         });

//         if (companyPackageData) {
//             return await ResponseHelper.OK(res, true, "Company Package Details Fetched Successfully!", companyPackageData, null, "Company package Details API");
//         }
//     } catch (error) {
//         return await ResponseHelper.ISError(res, error.message, "Company Package Details API");
//     }
// };

module.exports.getCompanyPackageDetailsForTransaction = async (req, res) => {
    try {
        let { subscription_id } = req.params;
        subscription_id = sanitizeHtml(subscription_id);

        if (!subscription_id) {
            return await ResponseHelper.NotFound(res, false, "Package Details not found!", null, null, "Company Package Details API");
        }

        const mappedData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: {
                subscription_id: subscription_id,
            },
        });

        const PackageData = await Package.findOne({
            where: {
                id: mappedData?.package_id,
            },
        });

        const transactionData = await RazorpayTransaction.findOne({
            where: {
                subscription_id: subscription_id,
            },
        });

        const companyPackageData = {
            PackageData,
            transactionData,
        };

        if (companyPackageData) {
            return await ResponseHelper.OK(res, true, "Company Package Details Fetched Successfully!", companyPackageData, null, "Company package Details API");
        }
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Company Package Details API");
    }
};

module.exports.addContactUsDetails = async (req, res) => {
    try {
        let { name, contactNumber, email, message } = req.body;

        name = sanitizeHtml(name);
        contactNumber = sanitizeHtml(contactNumber);
        email = sanitizeHtml(email);
        message = sanitizeHtml(message);

        const contactUsDetails = {
            name: name,
            contact_number: contactNumber,
            email: email,
            message: message,
        };

        const addedDetails = await ContactUs.create(contactUsDetails);

        if (addedDetails) return await ResponseHelper.Created(res, true, "Contact Details Added Successfully!", null, null, "Add Contact Us Details API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Add Contact Us Details API");
    }
};

module.exports.getCompanyDetails = async (req, res) => {
    try {
        let { company_id } = req.params;
        const companyId = sanitizeHtml(company_id);

        const companyDetails = await Companies.findOne({
            where: {
                id: companyId,
            },
        });

        const companyData = await CompanySignUpDetails.findOne({
            where: {
                id: companyDetails?.companies_sign_up_details_id,
            },
        });

        if (!companyData) {
            return await ResponseHelper.NotFound(res, false, "Company Details not found!", null, null, "Company Details API");
        }
        return await ResponseHelper.OK(res, true, "Company  Details Fetched Successfully!", companyData, null, "Company Details API");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Company Details API");
    }
};

module.exports.toggleFeatures = async (req, res) => {
    try {
        let {
            company_id,
            package_id,
            is_camera_visible,
            is_car_parking_visible,
            is_data_export_available,
            is_digital_log_visible,
            is_display_visitor_card_visible,
            is_id_proof_visible,
            is_print_visitor_card_visible,
            is_report_export_available,
            is_wifi_checkbox_visible,
            wifi_name,
            wifi_password,
        } = req.body;

        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);
        is_camera_visible = sanitizeHtml(is_camera_visible);
        is_car_parking_visible = sanitizeHtml(is_car_parking_visible);
        is_data_export_available = sanitizeHtml(is_data_export_available);
        is_digital_log_visible = sanitizeHtml(is_digital_log_visible);
        is_display_visitor_card_visible = sanitizeHtml(is_display_visitor_card_visible);
        is_id_proof_visible = sanitizeHtml(is_id_proof_visible);
        is_print_visitor_card_visible = sanitizeHtml(is_print_visitor_card_visible);
        is_report_export_available = sanitizeHtml(is_report_export_available);
        is_wifi_checkbox_visible = sanitizeHtml(is_wifi_checkbox_visible);
        wifi_name = sanitizeHtml(wifi_name);
        wifi_password = sanitizeHtml(wifi_password);

        const featuresData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
                package_id: package_id,
            },
        });

        if (!featuresData) {
            return await ResponseHelper.NotFound(res, "Feature settings not found for this company and package.", null, "Toggle Features API");
        }

        await featuresData.update({
            is_camera_visible,
            is_car_parking_visible,
            is_data_export_available,
            is_digital_log_visible,
            is_display_visitor_card_visible,
            is_id_proof_visible,
            is_print_visitor_card_visible,
            is_report_export_available,
            is_wifi_checkbox_visible,
            wifi_name,
            wifi_password,
        });

        return await ResponseHelper.OK(res, true, "Features updated successfully.", featuresData, "Toggle Features API");
    } catch (error) {
        console.error("ToggleFeatures Error:", error.message);
        return await ResponseHelper.ISError(res, error.message, "Toggle Features API");
    }
};

module.exports.getWifiDetails = async (req, res) => {
    try {
        let { package_id, company_id } = req.query;
        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);

        const wifiData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
                package_id: package_id,
            },
        });
        if (wifiData) {
            return ResponseHelper.OK(res, true, "Wifi Details Fetched successfully.", wifiData, "Wifi Details API");
        }
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Wifi Details API");
    }
};
