const Joi = require('joi')

const emailAuthSchema = {}

///#region email auth Schema
// Add Schema
emailAuthSchema.signUp = Joi.object().keys({
  email: Joi.string().email().required().max(50),
  country_code: Joi.string().required().optional().allow(''),
  mobile: Joi.string().pattern(/^[0-9]+$/).optional().allow(''),
  name: Joi.string().trim().required(), 
  language: Joi.string().required(),
  password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password and Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  // is_policy_agreed: Joi.boolean().required()
})

emailAuthSchema.verifyOtp = Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().min(4).max(4).required().messages({
      'number.min': 'OTP should be 4 digit.',
      'number.max': 'OTP should be 4 digit'
    })
  })

  emailAuthSchema.login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
      'string.pattern.base': 'Value must without any whitespace'
    }).min(8).required().max(50),
    fcm: Joi.string().required().optional().allow(''),
    device_id: Joi.string().required(),
    ip_address: Joi.string().required().optional().allow(''),
    device_name: Joi.string().required(),
    language: Joi.string().required()
  })

  emailAuthSchema.logout = Joi.object().keys({
    device_name: Joi.string().required(),
    fcm:  Joi.string().required().optional().allow(''),
    access_token: Joi.string().required()
  })


  emailAuthSchema.emailOtp = Joi.object().keys({
    email: Joi.string().email().required()
  })
  
  emailAuthSchema.resetPassword = Joi.object().keys({
    password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
      'string.pattern.base': 'Value must without any whitespace'
    }).min(8).required().max(50),
      access_token: Joi.string().required()
  })

  emailAuthSchema.changePassword = Joi.object().keys({
    password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
      'string.pattern.base': 'Value must without any whitespace'
    }).min(8).required().max(50),
      is_first_password_changed: Joi.bool().required()
  })

// social ID Registration

emailAuthSchema.socialIDRegistration = Joi.object().keys({
  email: Joi.string().email().required(),
  social_type: Joi.string().required(),
  social_id: Joi.string().required(), 
  language: Joi.string().required(),
  is_social_email: Joi.bool().required(),
  fcm:  Joi.string().required().optional().allow(''),
  device_id:  Joi.string().required().optional().allow(''),
  ip_address:  Joi.string().required().optional().allow(''),
  device_name:  Joi.string().required().optional().allow(''),
  name: Joi.string().required().optional().allow(''),
  is_social_email: Joi.boolean()

})
emailAuthSchema.socialSignin = Joi.object().keys({
  social_type: Joi.string().required(),
  social_id: Joi.string().required(),
  language: Joi.string().required(),
  is_social_email: Joi.bool().required(),
  fcm:  Joi.string().required().optional().allow(''),
  device_id:  Joi.string().required().optional().allow(''),
  ip_address:  Joi.string().required().optional().allow(''),
  device_name:  Joi.string().required().optional().allow(''),
  name: Joi.string().required().optional().allow(''),
  is_social_email: Joi.boolean()
})

emailAuthSchema.requestSocialOTP = Joi.object().keys({
  social_type: Joi.string().required(),
  social_id: Joi.string().required(),
  email: Joi.string().email().required(),
  user_id: Joi.number().integer().required(),
 
})

emailAuthSchema.verifySocialOTP = Joi.object().keys({
  social_type: Joi.string().required(),
  social_id: Joi.string().required(),
  user_id: Joi.number().integer().required(),
  fcm:  Joi.string().required().optional().allow(''),
  device_id:  Joi.string().required().optional().allow(''),
  ip_address:  Joi.string().required().optional().allow(''),
  device_name:  Joi.string().required().optional().allow(''),
  language: Joi.string().required(),
  otp: Joi.string().min(4).max(4).required().messages({
    'number.min': 'OTP should be 4 digit.',
    'number.max': 'OTP should be 4 digit'
  })
})

///#endregion

module.exports = {
    emailAuthSchema
}