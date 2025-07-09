const Joi = require('joi')

const adminAuthSchema = {}


adminAuthSchema.login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/^(\S+\s){0,0}\S+$/)
        .max(45)
        .messages({
            "string.pattern.base": "Value must without any whitespace",
        })
        .min(8)
        .required()
        .max(50),
    fcm: Joi.string().required().optional().allow(""),
    device_id: Joi.string().required(),
    ip_address: Joi.string().required().optional().allow(""),
    device_name: Joi.string().required(),
    language: Joi.string().required(),
});
module.exports = {
    adminAuthSchema
}
