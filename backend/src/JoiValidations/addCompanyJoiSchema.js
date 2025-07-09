const Joi = require("joi");

const addCompanySchema = {};

addCompanySchema.addNewCompanyDetails = Joi.object()
    .keys({
        name: Joi.string().trim().required().max(50),
        address: Joi.string().max(100).required(),
        package_id: Joi.number().required(),
        comment: Joi.string().allow("").optional(),
        duration: Joi.number().required(),
        image: Joi.string().optional().allow(" "),
        gender: Joi.string().max(100).required(),
        adminEmail: Joi.string().email().required(),
        adminPassword: Joi.string()
            .required()
            .regex(/^(\S+\s){0,0}\S+$/)
            .max(45)
            .messages({
                "string.pattern.base": "Value must without any whitespace",
            })
            .min(8)
            .required()
            .max(50),
        checkInEmail: Joi.string().email().required(),
        checkInPassword: Joi.string()
            .required()
            .regex(/^(\S+\s){0,0}\S+$/)
            .max(45)
            .messages({
                "string.pattern.base": "Value must without any whitespace",
            })
            .min(8)
            .required()
            .max(50),
    })
    .custom((value, helpers) => {
        if (value.adminEmail === value.checkInEmail) {
            return helpers.message("adminEmail and checkInEmail must be different");
        }
        return value;
    });

module.exports = {
    addCompanySchema,
};
