const Joi = require("joi");

const paymentSchema = {};

paymentSchema.createpaymentSchema = Joi.object().keys({
    company_id: Joi.number().required("Company ID is required"),
    package_id: Joi.number().required("Package ID is required"),
    stripe_package_id: Joi.number().required("Stripe Package ID is required"),
    paymentMethod: Joi.object().required("paymentMethod is required"),
});

paymentSchema.creditCardSchema = Joi.object().keys({
    cardNumber: Joi.number().required("Card number is required"),
    cardHolder: Joi.number().required("card holder name is required"),
    expiryDate: Joi.number().required("Expiry date is required"),
    cvv: Joi.number().required("Cvv is required"),
});

paymentSchema.createCustomerSchema = Joi.object().keys({
    email: Joi.string().required("Customer email is required"),
});

paymentSchema.createProductSchema = Joi.object().keys({
    stripe_package_name: Joi.string().required().messages({
        "string.empty": "Package name is required",
        "any.required": "Package name is required",
    }),
    stripe_package_price: Joi.number().integer().positive().required().messages({
        "number.base": "Package price must be a number",
        "number.integer": "Package price must be an integer",
        "number.positive": "Package price must be a positive number",
        "any.required": "Package price is required",
    }),
    currency: Joi.string().length(3).uppercase().required().messages({
        "string.length": "Currency code must be exactly 3 characters (e.g., USD, EUR)",
        "any.required": "Currency is required",
    }),
    billing_cycle: Joi.string().valid("day", "week", "month", "year").required().messages({
        "any.only": "Billing cycle must be one of: day, week, month, year",
        "any.required": "Billing cycle is required",
    }),
    validity_in_days: Joi.number().integer().positive().required().messages({
        "number.base": "Validity must be a number",
        "number.integer": "Validity must be an integer",
        "number.positive": "Validity must be a positive number",
        "any.required": "Validity in days is required",
    }),
    user_base: Joi.number().integer().positive().allow(null).messages({
        "number.base": "User base must be a number",
        "number.integer": "User base must be an integer",
        "number.positive": "User base must be a positive number",
    }),
});

paymentSchema.razorpayPaymentSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    interval: Joi.string().valid("monthly", "yearly").required().messages({
        "string.empty": "Interval is required",
    }),
    amount: Joi.number().required().messages({
        "any.required": "Amount is required",
    }),

    item: Joi.object({
        name: Joi.string().required().messages({
            "string.empty": "Package name is required",
        }),
        validity: Joi.number().integer().min(1).required().messages({
            "any.required": "Package validity is required",
        }),
    })
        .required()
        .messages({
            "object.base": "Item must be an object",
        }),

    company_id: Joi.string().required().messages({
        "string.empty": "Company ID is required",
    }),
    package_id: Joi.string().required().messages({
        "string.empty": "Package ID is required",
    }),
    callback_url: Joi.string().required().messages({
        "string.empty": "Call back url is required",
    }),
    trial_days: Joi.number().required("Trial Days is required"),

    redirect: Joi.boolean().required("Redirect is required"),
});

module.exports = { paymentSchema };
