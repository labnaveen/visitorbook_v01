const Joi = require("joi");

const addAdminSchema = {};

addAdminSchema.addAdmin = Joi.object().keys({
    firstname: Joi.string().trim().required(),
    middlename: Joi.string(),
    lastname: Joi.string().trim().required(),
    phone_prefix: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    department: Joi.string(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    picture: Joi.string(),
});

module.exports = {
    addAdminSchema,
};
