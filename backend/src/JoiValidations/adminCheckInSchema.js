const Joi = require("joi");

const adminCheckInSchema = {};

adminCheckInSchema.addCheckInCredentials = Joi.object().keys({
    check_in_email: Joi.string().required("Check in email is required"),
    check_in_password: Joi.string().required("Check in password is required"),
    role_id: Joi.number().required("Role id is required"),
});

adminCheckInSchema.updateCheckInCredentials = Joi.object().keys({
    old_check_in_email: Joi.string().required("Old Check in email is required"),
    check_in_email: Joi.string().required("Check in email is required"),
    check_in_password: Joi.string().required("Check in password is required"),
    company_id: Joi.number().required("Company id is required"),
});

adminCheckInSchema.sendOtp = Joi.object().keys({
    email: Joi.string().required("Email is required"),
});

adminCheckInSchema.verifyOtp = Joi.object().keys({
    email: Joi.string().required("Email is required"),
    otp: Joi.string().required("Otp is required"),
});

module.exports = { adminCheckInSchema };
