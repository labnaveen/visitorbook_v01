const Joi = require("joi");

const packageSchema = {};

packageSchema.addPackgeSchema = Joi.object().keys({
    package_name: Joi.string().required("Package name is required"),
    package_price: Joi.number().required("Package price is required"),
    validity_in_days: Joi.number().required("Package validity in days is required"),
    is_camera_visible: Joi.boolean().optional(),
    is_id_proof_visible: Joi.boolean().optional(),
    is_wifi_checkbox_visible: Joi.boolean().optional(),
    is_car_parking_visible: Joi.boolean().optional(),
    is_display_visitor_card_visible: Joi.boolean().optional(),
    is_print_visitor_card_visible: Joi.boolean().optional(),
    is_data_export_available: Joi.boolean().optional(),
    is_digital_log_visible: Joi.boolean().optional(),
    is_report_export_available: Joi.boolean().optional(),
    user_base: Joi.number().required("Package user base is required"),
});

packageSchema.editPackageSchema = Joi.object().keys({
    package_id: Joi.number().required("Package id is required"),
    package_name: Joi.string().required("Package name is required"),
    package_price: Joi.number().required("Package price is required"),
    validity_in_days: Joi.number().required("Package validity in days is required"),
    is_camera_visible: Joi.boolean().optional(),
    is_id_proof_visible: Joi.boolean().optional(),
    is_wifi_checkbox_visible: Joi.boolean().optional(),
    is_car_parking_visible: Joi.boolean().optional(),
    is_display_visitor_card_visible: Joi.boolean().optional(),
    is_print_visitor_card_visible: Joi.boolean().optional(),
    is_data_export_available: Joi.boolean().optional(),
    is_digital_log_visible: Joi.boolean().optional(),
    is_report_export_available: Joi.boolean().optional(),
    user_base: Joi.number().required("Package user base is required"),
});

packageSchema.companySignUp = Joi.object().keys({
    company_name: Joi.string().required().messages({ "any.required": "Company name is required" }),
    company_address: Joi.string().required().messages({ "any.required": "Company Address is required" }),
    company_admin_email: Joi.string().email().required().messages({
        "any.required": "Company email is required",
        "string.email": "Invalid email format",
    }),
    company_admin_password: Joi.string().required().messages({ "any.required": "Company password is required" }),
    gst_number: Joi.string().required().messages({ "any.required": "Company GST number is required" }),
    organization_type: Joi.number().required().messages({ "any.required": "Organization Type is required" }),
    package_id: Joi.string().required().messages({ "any.required": "Package ID is required" }),
});
packageSchema.wifiDetailsSchema = Joi.object().keys({
    wifi_name: Joi.string().required("Wifi name is required"),
    wifi_password: Joi.string().required("Wifi Password is required"),
    company_id: Joi.number().required("Company id is required"),
    package_id: Joi.number().required("Package id is required"),
});

packageSchema.contactUsSchema = Joi.object().keys({
    name: Joi.string().required("Name is required"),
    email: Joi.string().required("Email is required"),
    contactNumber: Joi.string().required("Contact Number is required"),
    message: Joi.string().allow("").optional(), // Allows empty strings and makes it optional
});

packageSchema.featuresUpdate = Joi.object().keys({
    company_id: Joi.number().required().messages({
        "any.required": "Company ID is required",
        "number.base": "Company ID must be a number",
    }),
    package_id: Joi.number().required().messages({
        "any.required": "Package ID is required",
        "number.base": "Package ID must be a number",
    }),
    is_camera_visible: Joi.boolean().required().messages({
        "any.required": "Camera visibility flag is required",
        "boolean.base": "Camera visibility must be a boolean",
    }),
    is_car_parking_visible: Joi.boolean().required().messages({
        "any.required": "Car parking visibility flag is required",
        "boolean.base": "Car parking visibility must be a boolean",
    }),
    // is_data_export_available: Joi.boolean().required().messages({
    //     "any.required": "Data export availability flag is required",
    //     "boolean.base": "Data export availability must be a boolean",
    // }),
    is_digital_log_visible: Joi.boolean().required().messages({
        "any.required": "Digital log visibility flag is required",
        "boolean.base": "Digital log visibility must be a boolean",
    }),
    is_display_visitor_card_visible: Joi.boolean().required().messages({
        "any.required": "Display visitor card flag is required",
        "boolean.base": "Display visitor card visibility must be a boolean",
    }),
    is_id_proof_visible: Joi.boolean().required().messages({
        "any.required": "ID proof visibility flag is required",
        "boolean.base": "ID proof visibility must be a boolean",
    }),
    is_print_visitor_card_visible: Joi.boolean().required().messages({
        "any.required": "Print visitor card flag is required",
        "boolean.base": "Print visitor card visibility must be a boolean",
    }),
    is_report_export_available: Joi.boolean().required().messages({
        "any.required": "Report export availability flag is required",
        "boolean.base": "Report export availability must be a boolean",
    }),
    is_wifi_checkbox_visible: Joi.boolean().required().messages({
        "any.required": "Wi-Fi checkbox visibility flag is required",
        "boolean.base": "Wi-Fi checkbox visibility must be a boolean",
    }),
    // wifi_name: Joi.string().required().messages({
    //     "any.required": "Wi-Fi name is required",
    //     "string.base": "Wi-Fi name must be a string",
    // }),
    // wifi_password: Joi.string().required().messages({
    //     "any.required": "Wi-Fi password is required",
    //     "string.base": "Wi-Fi password must be a string",
    // }),
});

module.exports = { packageSchema };
