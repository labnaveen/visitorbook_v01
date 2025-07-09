const authRoute = require('express').Router()
const emailAuthController = require('../controllers/emailAuthController')
const socialIDAuthController = require('../controllers/socialIDAuthController')
const validationMiddleware = require('../middlewares/validateRequest')
const auth = require('../middlewares/auth')
const emailValidationSchema = require('../JoiValidations/emailAuthJoiSchema')
const upload = require('../middlewares/imageUploader')

authRoute.post('/signup', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.signUp, 'body'), emailAuthController.emailSignup)
authRoute.post('/verifyotp', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.verifyOtp, 'body'), emailAuthController.otpVerify)
authRoute.post('/signin', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.login, 'body'), emailAuthController.signIn)
authRoute.get('/signout', auth.authenticate(null), emailAuthController.logout)
authRoute.get('/deleteuser', auth.authenticate(null), emailAuthController.deleteUser)
authRoute.get('/refreshtoken', auth.authenticate(null), emailAuthController.refreshToken)
authRoute.post('/otherdevicesignout', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.logout, 'body'), emailAuthController.otherDeviceLogout)
authRoute.post('/resendotp', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.emailOtp, 'body'), emailAuthController.resendOtpEmail)
authRoute.put('/resetpassword', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.resetPassword, 'body'), emailAuthController.resetPassword)

authRoute.put('/changepassword', auth.authenticate(null), validationMiddleware.validate(emailValidationSchema.emailAuthSchema.changePassword, 'body'), emailAuthController.passwordChange)

//Social ID 

authRoute.post('/uploadimage', upload.uploadImage.single('image'), emailAuthController.uploadImage)

authRoute.post('/socialidregistration', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.socialIDRegistration, 'body'), socialIDAuthController.Social_id_Registration)
authRoute.post('/socialsignin', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.socialSignin, 'body'), socialIDAuthController.socialSignin)

authRoute.post('/requestsocialotp', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.requestSocialOTP, 'body'), socialIDAuthController.requestSocialOTP)

authRoute.post('/verifysocialotp', validationMiddleware.validate(emailValidationSchema.emailAuthSchema.verifySocialOTP, 'body'), socialIDAuthController.verifySocialOTP)

module.exports = authRoute