const Joi = require("joi");

const visitorDetailsSchema = {};

///Visitor Information Schema

visitorDetailsSchema.visitorInformation = Joi.object().keys({
  image: Joi.string().allow(),
  name: Joi.string().trim().optional(),
  company: Joi.string().optional().allow(''),
  phone_prefix: Joi.string().required().max(10),
  phone_number: Joi.string().required().max(10),
  email: Joi.string().email().max(50),
  reason: Joi.string().required().max(200),
  employee_company_id: Joi.number().required(),
  employee_id: Joi.number().required(),
  vehicle_registration_number: Joi.string().max(10),
});

visitorDetailsSchema.login = Joi.object().keys({
  email: Joi.string().email().max(50),
  password: Joi.string()
    .regex(/^(\S+\s){0,0}\S+$/)
    .max(45)
    .messages({
      "string.pattern.base": "Password must without any whitespace !",
    })
    .min(8)
    .required()
    .max(50),
});

visitorDetailsSchema.mobileCheckIn = Joi.object().keys({
  email: Joi.string().email().max(50),
  companyId: Joi.string().max(50),
  mobile: Joi.number().required()
});

module.exports = {
  visitorDetailsSchema,
};
