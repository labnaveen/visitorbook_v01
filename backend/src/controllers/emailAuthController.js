require("../../swagger");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const accounts = require("../models/accountsModel");
const userOTP = require("../models/userEmailOTPModel");
const userDetails = require("../models/userDetailsModel");
const userDetailsArchive = require("../models/userDetailsModelArchive");
const userLogin = require("../models/userLoginModel");
const commonHelper = require("../helpers/CommonHelper");
const sequelize = require("../config/db.config").sequelize;
const { Op } = require("sequelize");
const sequelize_archive = require("../config/db.config").sequelize_archive;
const sanitizeHtml = require("sanitize-html");
const errorsHelper = require("../helpers/ErrorHelper");
const errorLogsCreator = require("../helpers/ErrorLogsCreator");

module.exports.resetPassword = async (req, res) => {
    try {
        let { password, access_token } = req.body;
        password = sanitizeHtml(password);
        const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
        const is_verify = jwt.verify(access_token, secret);
        const emailHash = is_verify._id;

        const userDetails = await accounts.findOne({
            where: { user_hash: emailHash },
        });
        if (!userDetails) {
            return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Invalid token!", "Reset password API!"));
        }
        const passwordHash = await commonHelper.createPasswordHash(password);
        if (userDetails.password === passwordHash) {
            return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("New and old password cannot be same!", "Reset password API!"));
        }
        const data = {
            password: passwordHash,
        };
        const updatePassword = await accounts.update(data, {
            where: { id: userDetails.id },
        });
        return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Your password has been updated!", null, null, "Reset password API!"));
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);

        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Reset password API!"));
    }
};

module.exports.otherDeviceLogout = async (req, res) => {
    try {
        const { access_token, fcm, device_name } = req.body;
        let secret = process.env.JWT_SECRET;
        secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!"; /// its only needed when unit test
        const verifyUser = jwt.verify(access_token, secret);

        const emailHash = verifyUser._id;
        const isExistsUser = await accounts.findOne({
            where: { user_hash: emailHash },
        });

        const isRefreshTokenValid = await userLogin.findOne({
            where: {
                account_id: isExistsUser.id,
                fcm: fcm,
                device_name: device_name,
            },
        });
        if (!isRefreshTokenValid) {
            return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Your session has expired, Please login again!", "Sign-out from Other devices API."));
        }
        // const tokenData = await userLogin.findOne({ where: { account_id: id, fcm: fcm, device_name: device_name } })
        if (isRefreshTokenValid) {
            const deletedTokenData = await userLogin.destroy({
                where: {
                    account_id: isExistsUser.id,
                    fcm: fcm,
                    device_name: device_name,
                },
            });
            if (deletedTokenData) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Logout successfully!", null, null, "Sign-out from Other devices API."));
            }
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };

        await errorLogsCreator.writeLog(data);

        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Sign-out from Other devices API."));
    }
};

module.exports.logout = async (req, res) => {
    try {
        const { id, fcm } = req.credentials;

        const tokenData = await userLogin.findOne({
            where: { account_id: id, fcm: fcm },
        });
        if (tokenData) {
            const deletedTokenData = await userLogin.destroy({
                where: { account_id: id, fcm: fcm },
            });
            if (deletedTokenData) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "'Logout successfully!", null, null, "ign-out API."));
            }
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Sign-out API."));
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const { id, fcm } = req.credentials;

        const tokenData = await accounts.findOne({ where: { id: id } });
        if (tokenData) {
            await sequelize_archive.transaction(async (t) => {
                const userDetailsData = {
                    account_id: tokenData.id,
                    name: tokenData.name,
                    mobile: tokenData.mobile,
                    email: tokenData.email,
                    country_code: tokenData.country_code,
                    user_id: tokenData.user_id,
                    language: tokenData.language,
                    dob: tokenData.dob,
                };
                const getUserDetail = await userDetailsArchive.create(userDetailsData, {
                    transaction: t,
                });

                const data = {
                    name: tokenData.name,
                    email: tokenData.email,
                    mobile: tokenData.mobile,
                    is_email_verify: tokenData.is_email_verify,
                    is_mobile_verify: tokenData.is_mobile_verify,
                    country_code: tokenData.country_code,
                    language: tokenData.language,
                    user_id: tokenData.user_id,
                    google_id: tokenData.google_id,
                    fb_id: tokenData.fb_id,
                    apple_id: tokenData.apple_id,
                    user_hash: tokenData.user_hash,
                    password: tokenData.password,
                    is_first_password_changed: tokenData.is_first_password_changed,
                    is_blocked: tokenData.is_blocked,
                    allowed_logins_in_web: tokenData.allowed_logins_in_web,
                    allowed_login_in_mobile: tokenData.allowed_login_in_mobile,
                    profile_image: tokenData.profile_image,
                    dob: tokenData.dob,
                    gender: tokenData.gender,
                    signup_by: tokenData.signup_by,
                };
                // const getUserDetails = await archiveAccounts.create(data, {
                //   transaction: t,
                // });
            });
            let deleteUser;

            await sequelize.transaction(async (t) => {
                const deleteUserDetails = await userDetails.destroy({ where: { account_id: id } }, { transaction: t });

                deleteUser = await accounts.destroy({ where: { id: id } }, { transaction: t });
            });

            if (deleteUser == 1) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "User has been deleted!", null, null, "Delete user account API!"));
            }
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Delete user account API!"));
    }
};

module.exports.resendOtpEmail = async (req, res) => {
    try {
        let { email } = req.body;
        email = sanitizeHtml(email);
        let updateOtp;

        const isUserExists = await accounts.findOne({ where: { email: email } });
        if (!isUserExists) {
            return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound(false, "This account does not exist.", "Resend OTP API."));
        } else {
            let otp;

            // await sequelize.transaction(async (t) => {
            // Removed unnecessary code related to 'user' creation

            otp = await commonHelper.genrateOTP();

            if (otp) {
                const emailReqData = {
                    to: email,
                    subject: "OTP for Email Verification",
                    text: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
            <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Glocal View</p>
              <p>1600 Amphitheatre Parkway</p>
              <p>California</p>
            </div>
          </div>
        </div>`,
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                      <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
                      </div>
                      <p style="font-size:1.1em">Hi,</p>
                      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                      <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
                      <hr style="border:none;border-top:1px solid #eee" />
                      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Glocal View</p>
                        <p>1600 Amphitheatre Parkway</p>
                        <p>California</p>
                      </div>
                    </div>
                  </div>`,
                };

                await commonHelper.sendOTPOnEmail(emailReqData);
                // const sendOTPonEmail = commonHelper.sendOTPOnEmail(emailReqData);

                const isotpexist = await userOTP.findOne({
                    where: { account_id: isUserExists.id },
                });
                if (isotpexist) {
                    const data = {
                        otp: otp,
                        otp_expired_datetime: new Date(Date.now() + 5 * 60 * 1000),
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    updateOtp = await userOTP.update(data, {
                        where: { id: isotpexist.id, account_id: isUserExists.id },
                    });
                } else {
                    const data = {
                        otp: otp,
                        account_id: isUserExists.id,
                        otp_expired_datetime: new Date(Date.now() + 5 * 60 * 1000),
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    updateOtp = await userOTP.create(data);
                }
            }
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "OTP sent on your email id!", updateOtp, null, "Resend OTP API!"));
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Resend OTP API!"));
    }
};

module.exports.signIn = async (req, res) => {
    try {
        let { email, password, fcm, device_id, ip_address, device_name, language } = req.body;
        email = sanitizeHtml(email).toLowerCase();
        password = sanitizeHtml(password);
        fcm = sanitizeHtml(fcm);
        device_id = sanitizeHtml(device_id);
        ip_address = sanitizeHtml(ip_address);
        device_name = sanitizeHtml(device_name);
        language = sanitizeHtml(language);
        if (ip_address == undefined || ip_address == "") {
            ip_address = req.socket.remoteAddress;
        }
        const existsUser = await accounts.findOne({ where: { email: email } });
        if (!existsUser) {
            return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound(false, "This email id is not exists!", "Sign-in API."));
        }
        const passwordHash = await commonHelper.createPasswordHash(password);
        if (existsUser.password !== passwordHash) {
            return res.status(errorsHelper.conflict).json(await errorsHelper.Conflict("Invalid Password!", null, "Sign-in API."));
        }
        if (existsUser.deleted_at != null) {
            return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("This account deleted by admin!", "Sign-in API."));
        }
        if (existsUser.is_blocked == 1) {
            return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Your email id has blocked, please contact to admin!", "Sign-in API."));
        }
        let otp, userOTPData;
        if (existsUser.is_email_verify == 0) {
            otp = await commonHelper.genrateOTP();
            if (otp) {
                const emailReqData = {
                    to: email,
                    subject: "OTP for Email Verification",
                    text: `<html><head><title>OTP for email verification</title></head><body><p>Dear User,</p><p>Your OTP for email verification is ${otp}</p>
          <p>If you did not request for otp, please ignore this email.</p><p>Please note that this otp is valid for 5 minutes</p><p>Thank you,</p><p>Foodsteps</p></body></html>`,
                    html: `<html><head><title>OTP for email verification</title></head><body><p>Dear User,</p><p>Your OTP for email verification is ${otp}</p>
                    <p>If you did not request for otp, please ignore this email.</p><p>Please note that this otp is valid for 5 minutes</p><p>Thank you,</p><p>Foodsteps</p></body></html>`,
                };
                await commonHelper.sendOTPOnEmail(emailReqData);

                const is_otp_user_Exists = await userOTP.findOne({
                    where: { account_id: existsUser.id },
                });
                if (is_otp_user_Exists) {
                    const data = {
                        otp: otp,
                        mail_otp_expired_datetime: new Date(Date.now() + 5 * 60 * 1000),
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    userOTPData = await userOTP.update(data, {
                        where: { id: is_otp_user_Exists.id },
                    });
                } else {
                    const data = {
                        account_id: existsUser.id,
                        otp: otp,
                        mail_otp_expired_datetime: new Date(Date.now() + 5 * 60 * 1000),
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    userOTPData = await userOTP.create(data);
                }
            }
            if (userOTPData) {
                const data = {
                    email_id: existsUser.email,
                    is_email_verifyed: existsUser.is_email_verify == 1 ? true : false
                };
                return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("This email id not verifyed, Please verify, OTP has sent on your email!", "Sign-in API."));
            }
        }
        const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
        const emailHash = existsUser.user_hash;
        const refreshToken = jwt.sign({ _id: emailHash }, secret, {
            expiresIn: "24h",
        });
        const access_token = jwt.sign({ _id: emailHash }, "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!", { expiresIn: "20m" });
        ///checking mobile logined sessions
        const user_login_details = await userLogin.findAll({
            where: { account_id: existsUser.id, fcm: { [Op.ne]: null } },
        });
        const currentMobileLoginSessions = user_login_details.length; //await userLogin.count({ where: { account_id: existsUser.id, fcm: { $ne: null } } })

        const allowedMobileLogins = existsUser.allowed_login_in_mobile;
        if (currentMobileLoginSessions === allowedMobileLogins && fcm != "" && user_login_details[0].dataValues.device_id != device_id) {
            let logedinDevicesList = await userLogin.findAll({
                attributes: ["account_id", "fcm", "device_id", "device_name"],
                where: { account_id: existsUser.id, fcm: { [Op.ne]: null } },
            });
            const data = {
                deviceList: logedinDevicesList,
                access_token: access_token,
            };
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(false, "Please logout from other device then login!", data, null, "Sign-in API!"));
        }
        /// checking web logined sessions
        const user_login_details_web = await userLogin.findAll({
            where: { account_id: existsUser.id, fcm: { [Op.ne]: null } },
        });
        const currentWebLoginSessions = user_login_details_web.length; //await userLogin.count({ where: { account_id: existsUser.id, fcm: { $eq: null } } })
        const allowedWebLogins = existsUser.allowed_logins_in_web;
        if (currentWebLoginSessions === allowedWebLogins && fcm == "" && user_login_details_web[0].dataValues.device_id != device_id) {
            let logedinDevicesList = await userLogin.findAll({
                attributes: ["account_id", "fcm", "device_id", "device_name"],
                where: { account_id: existsUser.id, fcm: { [Op.ne]: null } },
            });
            logedinDevicesList.access_token = access_token;
            const data = {
                deviceList: logedinDevicesList,
                access_token: access_token,
            };
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Please logout from other device then login!", data, null, "Sign-in API!"));
        }

        let tokenData, updateInUserDetails;

        const is_refresh_token_user_exists = await userLogin.findOne({
            where: { account_id: existsUser.id, fcm: fcm, device_id: device_id },
        });
        if (is_refresh_token_user_exists) {
            const data = {
                token: refreshToken,
                language: language,
                device_name: device_name,
                updated_at: new Date(),
            };
            tokenData = await userLogin.update(data, {
                where: { account_id: existsUser.id },
            });
        } else {
            const data = {
                account_id: existsUser.id,
                token: refreshToken,
                language: language,
                device_name: device_name,
                fcm: fcm,
                device_id: device_id,
                ip_address: ip_address,
                updated_at: new Date(),
                created_at: new Date(),
            };
            tokenData = await userLogin.create(data);
        }

        if (access_token) {
            const data = {
                id: existsUser.id,
                user_id: existsUser.user_id,
                email_id: existsUser.email,
                mobile: existsUser.mobile,
                profile_pic: existsUser.profile_image,
                access_token: access_token,
                refresh_token: refreshToken,
                is_email_verifyed: existsUser.is_email_verify == 1 ? true : false,
                is_mobile_verifyed: existsUser.is_mobile_verify == 1 ? true : false,
                is_first_password_changed: existsUser.is_first_password_changed == 1 ? true : false,
                fcm: fcm,
                device_id: device_id,
                language: language,
            };

            const is_user_exists_in_user_details = await userDetails.findOne({
                where: { language: language, account_id: existsUser.id },
            });
            if (!is_user_exists_in_user_details) {
                const userDetailsData = {
                    account_id: existsUser.id,
                    name: existsUser.name,
                    mobile: existsUser.mobile,
                    email: existsUser.email,
                    country_code: existsUser.country_code,
                    user_id: existsUser.user_id,
                    language: existsUser.language,
                    dob: existsUser.dob,
                };
                updateInUserDetails = await userDetails.create(userDetailsData);
            }
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "User login successfully!", data, null, "Sign-in API!"));
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Sign-in API!"));
    }
};

module.exports.otpVerify = async (req, res) => {
    try {
        let { email, otp } = req.body;
        email = sanitizeHtml(email);
        otp = sanitizeHtml(otp);
        const existsUser = await accounts.findOne({ where: { email: email } });
        if (!existsUser) {
            return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound(false, "Invalid email id!", "Verify emailed OTP API."));
        }
        const existsOtp = await userOTP.findOne({
            where: { account_id: existsUser.id, otp: otp },
        });
        if (!existsOtp) {
            return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound(false, "Invalid OTP!", "Verify emailed OTP API."));
        }
        const currentTime = new Date();
        let isOtpExpired;
        await sequelize.transaction(async (t) => {
            isOtpExpired = await userOTP.findOne(
                {
                    attributes: [[sequelize.literal(`created_at + interval 5 minute > '${currentTime.toISOString()}'`), "is_valid"]],
                    where: { account_id: existsUser.id, otp: otp },
                },
                { transaction: t }
            );
        });
        if (isOtpExpired.dataValues.is_valid === 0) {
            return res.status(errorsHelper.gone).json(await errorsHelper.Gone("OTP expired!", "Verify emailed OTP API."));
        }
        await accounts.update({ is_email_verify: 1 }, { where: { id: existsUser.id } });
        const access_token = jwt.sign({ _id: existsUser.user_hash }, "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!", { expiresIn: "5m" });
        const data = {
            is_validate: isOtpExpired.dataValues.is_valid == 1 ? true : false,
            access_token: access_token,
        };
        return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "OTP verifyed successfully!", data, null, "Verify emailed OTP API!"));
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Verify emailed OTP API!"));
    }
};

module.exports.emailSignup = async (req, res) => {
    try {
        let { email, country_code, mobile, name, language, password } = req.body;
        email = sanitizeHtml(email);
        country_code = sanitizeHtml(country_code);
        mobile = sanitizeHtml(mobile);
        name = sanitizeHtml(name);
        language = sanitizeHtml(language);
        password = sanitizeHtml(password);

        const isUserExists = await accounts.findOne({ where: { email: email } });
        if (isUserExists) {
            if (isUserExists.deleted_at !== null && isUserExists.is_blocked == 1) {
                return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("This account has been blocked or deleted by admin!", "User's sign-up API."));
            }
            const data = {
                email: isUserExists.email,
                country_code: isUserExists.country_code,
                mobile: isUserExists.mobile,
                is_email_verify: isUserExists.is_email_verify == 1 ? true : false,
                is_mobile_verify: isUserExists.is_mobile_verify == 1 ? true : false,
                language: isUserExists.language,
            };
            return res.status(errorsHelper.conflict).json(await errorsHelper.Conflict("There is already a user with this email!", data, "User's sign-up API."));
        }
        const passwordHash = await commonHelper.createPasswordHash(password);
        const emailHash = await commonHelper.createPasswordHash(email);
        // sign up email hash
        if (passwordHash) {
            const emailData = {
                name: name,
                email: email,
                country_code: country_code,
                is_first_password_changed: 1,
                mobile: mobile,
                password: passwordHash,
                user_hash: emailHash,
                signup_by: "email",
                language: language,
            };
            let createdUser, resData, userOTPData, otp;
            await sequelize.transaction(async (t) => {
                createdUser = await accounts.create(emailData, { transaction: t });

                const userDetailsData = {
                    account_id: createdUser.id,
                    name: createdUser.name,
                    mobile: createdUser.mobile,
                    email: createdUser.email,
                    country_code: createdUser.country_code,
                    user_id: createdUser.user_id,
                    language: createdUser.language,
                    dob: createdUser.dob,
                };

                const updateInUserDetails = await userDetails.create(userDetailsData, {
                    transaction: t,
                });

                otp = await commonHelper.genrateOTP();
                if (otp) {
                    const emailReqData = {
                        to: email,
                        subject: "OTP for Email Verification",
                        text: `<html><head><title>OTP for email verification</title></head><body><p>Dear User,</p><p>Your OTP for email verification is ${otp}</p>
            <p>If you did not request for otp, please ignore this email.</p><p>Please note that this otp is valid for 5 minutes</p><p>Thank you,</p><p>Foodsteps</p></body></html>`,
                        html: `<html><head><title>OTP for email verification</title></head><body><p>Dear User,</p><p>Your OTP for email verification is ${otp}</p>
                    <p>If you did not request for otp, please ignore this email.</p><p>Please note that this otp is valid for 5 minutes</p><p>Thank you,</p><p>Foodsteps</p></body></html>`,
                    };
                    await commonHelper.sendOTPOnEmail(emailReqData);

                    const data = {
                        account_id: createdUser.id,
                        otp: otp,
                        otp_expired_daytime: new Date(Date.now() + 5 * 60 * 1000),
                    };
                    userOTPData = await userOTP.create(data, { transaction: t });
                }
            });
            if (createdUser) {
                const access_token = jwt.sign({ _id: createdUser.user_hash }, "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!", { expiresIn: "20m" });

                resData = {
                    id: createdUser.id,
                    email_id: createdUser.email,
                    firstname: createdUser.name,
                    country_code: createdUser.country_code,
                    mobile: createdUser.mobile,
                    is_email_verifyed: createdUser.is_email_verifyed == 1 ? true : false,
                    is_first_password_changed: createdUser.is_first_password_changed == 1 ? true : false
                };
                return res.status(errorsHelper.created).json(await errorsHelper.Created(true, "User added successfully and OTP sent on your email id!", resData, null, "User's sign-up API."));
            }
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);

        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "User's sign-up API."));
    }
};

module.exports.refreshToken = async (req, res) => {
    try {
        const { id, fcm, emailHash } = req.credentials;

        const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
        const refreshToken = jwt.sign({ _id: emailHash }, secret, {
            expiresIn: "24h",
        });

        const data = {
            token: refreshToken,
        };

        const updatePassword = await userLogin.update(data, {
            where: { account_id: id, fcm: fcm },
        });
        return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Refresh token updated succesfully!", data, null, "Refersh token API!"));
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);

        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Sign-out API."));
    }
};

module.exports.uploadImage = async (req, res) => {
    try {
        let { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file;
        // const { id } = req.credentials
        const currenttime = new Date().getTime();
        const fName = `${currenttime}_${originalname}`;
        const data = {
            fileName: fName,
            file: req.file,
        };
        const uploadDetails = await commonHelper.upload_aws(data);
        const url = `https://quizwizzlive.s3.eu-north-1.amazonaws.com/uploads/quiz/${fName}`;
        const resData = {
            url: url,
        };
        if (uploadDetails) {
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Image uploaded successfully!", resData, null, "Upload image in S3-Bucket API!"));
        }
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
        };
        await errorLogsCreator.writeLog(data);

        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Upload image in S3-Bucket API!"));
    }
};

module.exports.passwordChange = async (req, res) => {
    const { id, email } = req.credentials;
    try {
        let { password, is_first_password_changed } = req.body;
        password = sanitizeHtml(password);
        is_first_password_changed = sanitizeHtml(is_first_password_changed);

        const userDetails1 = await accounts.findOne({ where: { email: email } });
        if (!userDetails) {
            return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Invalid token!", "Change password API!"));
        }
        if (is_first_password_changed) {
            const passwordHash = await commonHelper.createPasswordHash(password);
            const data = {
                password: passwordHash,
                is_first_password_changed: 1,
            };
            const updatePassword = await accounts.update(data, {
                where: { id: userDetails.id },
            });
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Your password has been updated!", null, null, "Change password API!"));
        }
        const passwordHash = await commonHelper.createPasswordHash(password);
        const data = {
            password: passwordHash,
        };
        const updatePassword = await accounts.update(data, {
            where: { id: userDetails.id },
        });
        return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Your password has been updated!", null, null, "Change password API!"));
    } catch (error) {
        const data = {
            error: error.message,
            errorStack: error.stack,
            inputs: req.body,
        };
        await errorLogsCreator.writeLog(data);
        return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Change password API!"));
    }
};
