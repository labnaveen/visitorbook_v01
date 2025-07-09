
const Joi = require('joi')

const changePasswordSchema = {}


changePasswordSchema.changePassword = Joi.object().keys({
    password: Joi.string()
        .required()
        .regex(/^(\S+\s){0,0}\S+$/)
        .max(45)
        .messages({
            "string.pattern.base": "Value must without any whitespace",
        })
        .min(8)
        .required()
        .max(50),
    is_first_password_changed: Joi.bool().optional(),
});

module.exports = {
    changePasswordSchema
}