const Joi = require("joi");

const forgetPasswordSchema = {};

forgetPasswordSchema.forgetPassword = Joi.object().keys({
    // password: Joi.string()
    //     .required()
    //     .regex(/^(\S+\s){0,0}\S+$/)
    //     .max(45)
    //     .messages({
    //         "string.pattern.base": "Value must without any whitespace",
    //     })
    //     .min(8)
    //     .required()
    //     .max(50),
    email: Joi.string().required("Email is required"),
    // access_token: Joi.string().required(),
});

module.exports = {
    forgetPasswordSchema,
};
