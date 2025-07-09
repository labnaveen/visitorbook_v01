const Joi = require('joi')

const emailAuthSchema = {}
const accountTypeSchema = {}
const dietTypeSchema = {}
const subscriptionPlanSchema = {}
const postSchema = {}
const settingSchema = {}
const adminSchema = {}
const recipeSchema = {}
const weekllyPlanner = {}
const courseSchema = {}
const plan = {}
const grocerySchema = {}
const leftover = {}
const budgetToolSchema = {}
//#region email auth Schema
// Add Schema
emailAuthSchema.signUp = Joi.object().keys({
  email: Joi.string().email().required().max(50),
  country_code: Joi.string().required().optional().allow(''),
  mobile: Joi.string().pattern(/^[0-9]+$/)
  .optional().allow(''),
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

emailAuthSchema.migrationSignUp = Joi.object().keys({
  email: Joi.string().email().required(),  
  password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password and Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' }),
  is_policy_agreed: Joi.boolean().required()
})

emailAuthSchema.emailOtp = Joi.object().keys({
  email: Joi.string().email().required()
})
emailAuthSchema.verifyOtp = Joi.object().keys({
  email: Joi.string().email().required(),
  otp: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.min': 'OTP should be 4 digit.',
    'number.max': 'OTP should be 4 digit'
  })
})

emailAuthSchema.signUpSocial = Joi.object().keys({
  firstname: Joi.string().required().max(50),
  lastname: Joi.string().required().max(50),
  dob: Joi.string().required(),
  email: Joi.string().email().required(),
  country_code: Joi.string().required().optional().allow(''),
  phone_number: Joi.string()
    .pattern(/^[0-9]+$/)
    .optional().allow(''),
  social_platform_name: Joi.string().required().max(50),
  social_id: Joi.string().required().max(50),
  is_policy_agreed: Joi.boolean().required(),
  is_social_email: Joi.boolean().required()
})

emailAuthSchema.onboradDetails = Joi.object().keys({
  language: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Language must without any whitespace'
  }).required().max(50),
  account_type_id: Joi.number().required(),
  diet_type_id: Joi.number().required(),
  // subscription_plan_id: Joi.number().required()
})


emailAuthSchema.login = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  fcm: Joi.string().required().optional().allow(''),
  device_id: Joi.string().required().optional().allow(''),
  ip_address_address: Joi.string().required().optional().allow('')
})
emailAuthSchema.socialLogin = Joi.object().keys({
  email: Joi.string().email().required().optional().allow(''),
  social_id: Joi.string().required(),
  social_platform_name: Joi.string().required()
})

emailAuthSchema.forgotPWD = Joi.object().keys({
  email: Joi.string().email().required().max(50)
})

emailAuthSchema.setPassword = Joi.object().keys({

  password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password and Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
})
emailAuthSchema.refreshToken = Joi.object().keys({
  refreshtoken: Joi.string().required()
})
emailAuthSchema.updateProfile = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  bio: Joi.string().required().optional().allow(''),
  profile_url: Joi.string().required().optional().allow('')
})

emailAuthSchema.followingsUserAccount = Joi.object().keys({
  follow_user_id: Joi.number()
})
emailAuthSchema.followerUserAccount = Joi.object().keys({
  follower_user_id: Joi.number()
})

emailAuthSchema.addVGCsubscription = Joi.object().keys({
  email_id:  Joi.string().email().required(),
  is_vipps_subscription: Joi.number().required(),
  is_gift_card_applied: Joi.number().required(),
  month: Joi.number().required(),
  vipps_start_datetime: Joi.string().required().optional().allow(''),
  vipps_end_datetime: Joi.string().required().optional().allow(''),
  giftcard_start_datetime: Joi.string().required().optional().allow(''),
  giftcard_end_datetime: Joi.string().required().optional().allow('')
})
//#endregion

//#region Common shcema
accountTypeSchema.accountType = Joi.object().keys({
  name: Joi.string().required().max(50),
  description: Joi.string().required().optional().allow(''),
})
accountTypeSchema.updateAccountType = Joi.object().keys({
  // account_type_id: Joi.number().required(),
  name: Joi.string().required().max(50),
  description: Joi.string().required().optional().allow(''),
})
dietTypeSchema.dietType = Joi.object().keys({
  name: Joi.string().required().max(50),
  description: Joi.string().required().optional().allow(''),
})
dietTypeSchema.updateDietType = Joi.object().keys({
  // diet_type_id: Joi.number().required(),
  name: Joi.string().required().max(50),
  description: Joi.string().required().optional().allow(''),
})

subscriptionPlanSchema.planDetails = Joi.object().keys({
  name: Joi.string().required().max(50),
  amount: Joi.number().required(),
  description: Joi.string().required().optional().allow(''),
  feature_descriptions: Joi.string().required().optional().allow(''),
  country_code: Joi.string().required().max(50)
})
subscriptionPlanSchema.updatePlan = Joi.object().keys({
  // plan_id: Joi.number().required(),
  plan_name: Joi.string().required().max(50),
  plan_amount: Joi.number().required(),
  plan_description: Joi.string().required().optional().allow(''),
  plan_feature_descriptions: Joi.string().required().optional().allow(''),
  plan_country_code: Joi.string().required().max(50)
})
//#endregion

//#region Post schema
postSchema.addLike = Joi.object().keys({
  post_id: Joi.number().required()
})

postSchema.addComment = Joi.object().keys({
  post_id: Joi.number(),
  comment_text: Joi.string().required().max(5000),
  commnet_image_url: Joi.string().required().optional().allow('')
})
postSchema.addPost = Joi.object().keys({
  title: Joi.string().required(),
  post_text: Joi.string().required().max(5000),
  image_url: Joi.string().required()
})
postSchema.deletePost = Joi.object().keys({
  post_id: Joi.number().required()
})
//#endregion

//#region  Setting Joi

settingSchema.updateLanguage = Joi.object().keys({
  language: Joi.string().required()
})
settingSchema.foodPreference = Joi.object().keys({
  diettype_id: Joi.number().required()
})
settingSchema.updateSubscriptionPlan = Joi.object().keys({
  plan_id: Joi.number().required()
})
settingSchema.updatePhoneNumber = Joi.object().keys({
  country_code: Joi.number().required().optional().allow(''),
  phone_number: Joi.number().required().optional().allow('')
})
settingSchema.updatePassword = Joi.object().keys({
  old_password: Joi.string().required(),
  new_password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  confirm_password: Joi.any().equal(Joi.ref('new_password'))
    .required()
    .label('New Password and Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
})
//#endregion

//#region Admin schema

adminSchema.login = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50)
})

adminSchema.refreshToken = Joi.object().keys({
  refreshtoken: Joi.string().required()
})

adminSchema.forgotPWD = Joi.object().keys({
  email: Joi.string().email().required().max(50)
})

adminSchema.verifyOtp = Joi.object().keys({
  email: Joi.string().email().required(),
  otp: Joi.number().integer().min(1000).max(9999).required().messages({
    'number.min': 'OTP should be 4 digit.',
    'number.max': 'OTP should be 4 digit'
  })
})
adminSchema.setPassword = Joi.object().keys({

  password: Joi.string().required().regex(/^(\S+\s){0,0}\S+$/).max(45).messages({
    'string.pattern.base': 'Value must without any whitespace'
  }).min(8).required().max(50),
  confirm_password: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Password and Confirm password')
    .messages({ 'any.only': '{{#label}} does not match' })
})

adminSchema.addTrendingRecipe = Joi.object().keys({
  recipe_id: Joi.string().required()
})
adminSchema.addLatestRecipe = Joi.object().keys({
  recipe_id: Joi.string().required()
})
adminSchema.removeUsersPost = Joi.object().keys({
  user_id: Joi.number().required(),
  post_id: Joi.number().required()
})
adminSchema.editUsersPost = Joi.object().keys({
  user_id: Joi.number().required(),
  post_id: Joi.number().required(),
  title: Joi.string().required(),
  post_text: Joi.string().required(),
  image_url: Joi.string().required()
})
adminSchema.addWeeklyMenu = Joi.object().keys({
  menu_name: Joi.string().required(),
  menu_image_url: Joi.string().required()
})
adminSchema.updateWeeklyMenu = Joi.object().keys({
  menu_name: Joi.string().required(),
  menu_image_url: Joi.string().required()
})

adminSchema.addWeeklyMenuRecipe = Joi.object().keys({
  sanity_recipe_id: Joi.string().required(),
  menu_type_id: Joi.number().required()
})
adminSchema.addFilterCategory = Joi.object().keys({
  category_name_en: Joi.string().required(),
  category_name_no: Joi.string().required()
})
adminSchema.updateFilterCategory = Joi.object().keys({
  category_name_en: Joi.string().required(),
  category_name_no: Joi.string().required()
})

adminSchema.addFilters = Joi.object().keys({
  category_id: Joi.number().required(),
  filter_name_en: Joi.string().required(),
  filter_name_no: Joi.string().required()
})
adminSchema.updateFilter = Joi.object().keys({
  category_id: Joi.number().required(),
  category_name_en: Joi.string().required(),
  category_name_no: Joi.string().required()
})
//#endregion

//#region recipe schema
recipeSchema.addFavrouitesRecipe = Joi.object().keys({
  recipe_id: Joi.string().required()
})

//#endregion

//#region weekllyPlanner
weekllyPlanner.saveMyMenu = Joi.object().keys({
  menu_name: Joi.string().required(),
  recipe_ids: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      recipe_image_url: Joi.string()
    })
  ).required(),
})
weekllyPlanner.removeMySavedRecipe = Joi.object().keys({
  menu_id: Joi.number().required(),
  recipe_id: Joi.string().required()
})

//#endregion
//#region 
courseSchema.addLectureProgress = Joi.object().keys({
  // user_id: Joi.number().required(),
  course_id: Joi.string().required(),
  lecture_id: Joi.string().required(),
  progress: Joi.number().required()
})
//#endregion
//#region 
plan.addPlan = Joi.object().keys({
  user_id: Joi.number().required(),
  month: Joi.number().required(),
  amount: Joi.number().required().optional().allow(''),
  currency: Joi.string().required().optional().allow(''),
  payment_type: Joi.string().required(),
  payment_agreement_id: Joi.string().required().optional().allow(null),
  payment_agreement_status: Joi.string().required(),
  product: Joi.string().required(),
  variant: Joi.string().required().optional().allow(null),
  renewal: Joi.number().required(),
  payment_type_store: Joi.string().required(),
  transaction_id: Joi.string().required(),
  campaign_price: Joi.number().required().optional().allow(null),
  campaign_months: Joi.number().required().optional().allow(null),
  campaign_coupon_id: Joi.number().required().optional().allow(null),
  campaign_end_date: Joi.date().required().optional().allow(null),
  original_purchase_date: Joi.date().required(),
  expires_date: Joi.date().required()
})
//#endregion

//#region grocery list
grocerySchema.addItems = Joi.object().keys({
  items: Joi.array().items(Joi.object({
    item_name: Joi.string().required(),
    department: Joi.string().required(),
    no_of_persons: Joi.number(),
    unit: Joi.string().allow(''),
    quantity: Joi.string().allow('')
  }))
  })
  grocerySchema.addItem = Joi.object().keys({
    item_name: Joi.string().required(),
    department: Joi.string().required(),
    unit: Joi.string().allow(''),
    quantity: Joi.string().allow('')
    })
//#endregion


//#region leftover
leftover.keys = Joi.object().keys({
  ingredients: Joi.array().items().required()
  })
 
//#endregion
//#region leftover
budgetToolSchema.items = Joi.object().keys({
  persons: Joi.number().required(),
  days: Joi.number().required(),
  amount: Joi.number().required(),
  food_prefrence: Joi.string().required()
  })
 
//#endregion

module.exports = {
  emailAuthSchema,
  accountTypeSchema,
  dietTypeSchema,
  subscriptionPlanSchema,
  postSchema,
  settingSchema,
  adminSchema,
  recipeSchema,
  weekllyPlanner,
  courseSchema,
  plan,
  grocerySchema,
  leftover,
  budgetToolSchema
}