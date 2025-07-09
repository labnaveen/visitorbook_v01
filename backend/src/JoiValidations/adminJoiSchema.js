const Joi = require('joi');
const { refreshToken } = require('../controllers/adminController');

const authSchema = {};
const departmentSchema = {};
const companySchema = {};
const appSettingsSchema = {};

authSchema.refreshToken = Joi.object().keys({
    refreshToken: Joi.string().required()    
});
departmentSchema.addDepartment = Joi.object().keys({
    name: Joi.string().trim().required(),
    color: Joi.string().trim().required()
});
departmentSchema.updateDepartment = Joi.object().keys({
    id: Joi.number().integer().required(),
    name: Joi.string().trim().required(),
    color: Joi.string().trim().required()
});
departmentSchema.enableDisableDepartment = Joi.object().keys({
    id: Joi.number().integer().required(),
    isDisabled: Joi.number().integer().required().valid(0,1)
});

companySchema.activateDeactivateCompany = Joi.object().keys({
    id: Joi.number().integer().required(),
    isActive: Joi.number().integer().required().valid(0,1)
});
appSettingsSchema.edit = Joi.object().keys({
    companyId: Joi.number().integer().required(),
    isDisplayVisitorFace: Joi.number().integer().required().valid(0,1),
    isDisplayCarParkingCheckbox: Joi.number().integer().required().valid(0,1),
    isDisplayWifiCheckbox: Joi.number().integer().required().valid(0,1),
    isDisplayIdProof: Joi.number().integer().required().valid(0,1),
    isDisplayDigitalCard: Joi.number().integer().required().valid(0,1),
    isDisplayPrintVisitorCard: Joi.number().integer().required().valid(0,1),
    wifiName: Joi.string().trim().optional().allow('', null),
    wifiPassword: Joi.string().trim().optional().allow('', null)
});


module.exports = {
    authSchema,
    departmentSchema,
    companySchema,
    appSettingsSchema
};
