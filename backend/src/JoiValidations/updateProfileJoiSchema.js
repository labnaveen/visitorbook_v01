const Joi = require("joi");

const updateProfileSchema = {};

updateProfileSchema.updateProfileDetails = Joi.object().keys({
    firstname: Joi.string().trim().optional(),
    middlename: Joi.string().trim().optional(),
    lastname: Joi.string().trim().optional(),
    phone_prefix: Joi.string().trim().optional(),
    phone: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    role: Joi.string().trim().valid("admin", "employee"),
    email: Joi.string().email().optional(),
    image: Joi.string().trim().optional(),
    password: Joi.string().when("role", {
        is: "admin",
        then: Joi.string().required().messages({
            "any.required": "Password is required when role is admin",
        }),
        otherwise: Joi.forbidden(),
    }),
});

module.exports = {
    updateProfileSchema,
};
