const Joi = require('joi');

const updateAdminSchema = {};

updateAdminSchema.updateAdmin = Joi.object().keys({
    firstname: Joi.string().trim().required(),
    middlename: Joi.string(),
    lastname: Joi.string().trim().required(),
    phone_prefix: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    department: Joi.number().integer().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    picture: Joi.string(),
    password: Joi.string()
});

module.exports = {
    updateAdminSchema
};
