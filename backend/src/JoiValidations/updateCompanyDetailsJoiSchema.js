const Joi = require("joi");

const updateCompanyDetails = {};

updateCompanyDetails.updateNewCompanyDetails = Joi.object().keys({
    name: Joi.string().trim().max(50),
    address: Joi.string().max(100),
    image: Joi.string().optional().allow(" "),
    code: Joi.string().optional().allow(" "),
    package_id: Joi.number().required(),
    duration: Joi.number().required(),
});

module.exports = {
    updateCompanyDetails,
};
