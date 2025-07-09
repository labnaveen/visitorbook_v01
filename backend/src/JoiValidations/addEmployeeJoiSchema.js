const Joi = require('joi');

const addEmployeeSchema = {};

addEmployeeSchema.addNewEmployee = Joi.object().keys({
    firstname: Joi.string().trim().required(),
    middlename: Joi.string().trim().optional(),
    lastname: Joi.string().trim().required(),
    phone_prefix: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    department: Joi.number().integer().required(),
    role: Joi.string().trim().valid('admin', 'employee').required(),
    email: Joi.string().email().required(),
    picture: Joi.string().trim().optional(),
    password: Joi.string().when('role', {
        is: 'admin',
        then: Joi.string().required().messages({
            'any.required': 'Password is required when role is admin'
        }),
        otherwise: Joi.forbidden()
    })
});

module.exports = { addEmployeeSchema };
