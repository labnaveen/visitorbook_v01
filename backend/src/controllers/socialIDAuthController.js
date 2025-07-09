require("../../swagger");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const accounts = require("../models/accountsModel");
const userOTP = require("../models/userEmailOTPModel");
const userLogin = require("../models/userLoginModel");
const userDetails = require("../models/userDetailsModel");
const commonHelper = require("../helpers/CommonHelper");
const sequelize = require("../config/db.config").sequelize;
const sanitizeHtml = require("sanitize-html");
const errorsHelper = require("../helpers/ErrorHelper");
const { Op } = require("sequelize");
const errorLogsCreator = require("../helpers/ErrorLogsCreator");

module.exports.Social_id_Registration = async (req, res) => {
  try {
    let {
      email,
      social_type,
      social_id,
      is_social_email,
      language,
      fcm,
      device_id,
      ip_address,
      device_name,
    } = req.body;
    email = sanitizeHtml(email);
    social_type = sanitizeHtml(social_type);
    social_id = sanitizeHtml(social_id);
    language = sanitizeHtml(language);
    fcm = sanitizeHtml(fcm);
    device_id = sanitizeHtml(device_id);
    ip_address = sanitizeHtml(ip_address);
    device_name = sanitizeHtml(device_name);

    let createdUser;

    const isUserExists = await accounts.findOne({ where: { email: email } });
    if (isUserExists) {
      const data = {
        is_email_verified: false,
        email: "",
      };
      return res
        .status(errorsHelper.conflict)
        .json(
          await errorsHelper.Conflict(
            "This email id already associated with another account!",
            data,
            "User's social sign-up API."
          )
        );
    }
    if (is_social_email == false) {
      const emailHash = await commonHelper.createPasswordHash(social_id);
      const data = {
        email: email,
        name: email,
        user_hash: emailHash,
        signup_by: social_type,
        language: language,
      };
      let socialData = {};
      switch (social_type) {
        case "google":
          data.google_id = social_id;
          socialData.google_id = social_id;
          break;

        case "apple":
          data.apple_id = social_id;
          socialData.apple_id = social_id;
          break;

        case "facebook":
          data.fb_id = social_id;
          socialData.fb_id = social_id;
          break;

        default:
          data.google_id = social_id;
          socialData.google_id = social_id;
          break;
      }

      const isSocialIdExists = await accounts.findOne({ where: socialData });
      if (isSocialIdExists) {
        const socialData = {
          is_email_verified: false,
          email: "",
        };
        return res
          .status(errorsHelper.conflict)
          .json(
            await errorsHelper.Conflict(
              "This social id already associated with another email account!",
              socialData,
              "User's social sign-up API."
            )
          );
      }
      createdUser = await accounts.create(data);
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
      console.log("<<<<userDetailsData>>>>", userDetailsData);

      const updateInUserDetails = await userDetails.create(userDetailsData);

      const resData = {
        id: createdUser.id,
        email: createdUser.email,
        is_email_verified: createdUser.is_email_verify == 1 ? true : false,
        social_id: social_id,
      };
      return res
        .status(errorsHelper.created)
        .json(
          await errorsHelper.Created(
            true,
            "Registered successfully!",
            resData,
            null,
            "User's social sign-up API."
          )
        );
    } else {
      const emailHash = await commonHelper.createPasswordHash(social_id);
      const data = {
        email: email,
        name: email,
        user_hash: emailHash,
        signup_by: social_type,
        language: language,
        is_email_verify: 1,
      };
      let socialData = {};
      switch (social_type) {
        case "google":
          data.google_id = social_id;
          socialData.google_id = social_id;
          break;

        case "apple":
          data.apple_id = social_id;
          socialData.apple_id = social_id;
          break;

        case "facebook":
          data.fb_id = social_id;
          socialData.fb_id = social_id;
          break;

        default:
          data.google_id = social_id;
          socialData.google_id = social_id;
          break;
      }

      const isSocialIdExists = await accounts.findOne({ where: socialData });
      if (isSocialIdExists) {
        const socialResData = {
          is_email_verified: false,
          email: "",
        };
        return res
          .status(errorsHelper.conflict)
          .json(
            await errorsHelper.Conflict(
              "This social id already associated with another email account!",
              socialResData,
              "User's social sign-up API."
            )
          );
      }
      createdUser = await accounts.create(data);
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
      console.log("<<<<userDetailsData>>>>", userDetailsData);

      const updateInUserDetails = await userDetails.create(userDetailsData);

      const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
      const refreshToken = jwt.sign({ _id: emailHash }, secret, {
        expiresIn: "24h",
      });
      const access_token = jwt.sign(
        { _id: emailHash },
        "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!",
        { expiresIn: "20m" }
      );
      let tokenData;
      const is_refresh_token_user_exists = await userLogin.findOne({
        where: { account_id: createdUser.id, fcm: fcm, device_id: device_id },
      });
      if (is_refresh_token_user_exists) {
        const data = {
          token: refreshToken,
          language: language,
          device_name: device_name,
          updated_at: new Date(),
        };
        tokenData = await userLogin.update(data, {
          where: { account_id: createdUser.id },
        });
      } else {
        const data = {
          account_id: createdUser.id,
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
        const resData = {
          id: createdUser.id,
          user_id: createdUser.user_id,
          email_id: createdUser.email,
          mobile: createdUser.mobile,
          profile_pic: createdUser.profile_image,
          access_token: access_token,
          refresh_token: refreshToken,
          is_email_verifyed: createdUser.is_email_verify == 1 ? true : false,
          is_mobile_verifyed: createdUser.is_mobile_verify == 1 ? true : false,
          is_first_password_changed:
            createdUser.is_first_password_changed == 1 ? true : false,
          fcm: fcm,
          device_id: device_id,
          language: language,
          social_id: social_id,
        };
        return res
          .status(errorsHelper.created)
          .json(
            await errorsHelper.Created(
              true,
              "Registered successfully!",
              resData,
              null,
              "User's social sign-up API."
            )
          );
      }
    }
  } catch (error) {
    const data = {
      error: error.message,
      errorStack: error.stack,
    };

    await errorLogsCreator.writeLog(data);

    return res
      .status(errorsHelper.iSError)
      .json(
        await errorsHelper.ISError(error.message, "User's social sign-up API.")
      );
  }
};

module.exports.socialSignin = async (req, res) => {
  try {
    let {
      social_id,
      social_type,
      is_social_email,
      language,
      signup_by,
      fcm,
      device_id,
      ip_address,
      device_name,
    } = req.body;
    social_id = sanitizeHtml(social_id);
    social_type = sanitizeHtml(social_type);
    language = sanitizeHtml(language);
    signup_by = sanitizeHtml(signup_by);
    fcm = sanitizeHtml(fcm);
    device_id = sanitizeHtml(device_id);
    ip_address = sanitizeHtml(ip_address);
    device_name = sanitizeHtml(device_name);
    const data = {};
    switch (social_type) {
      case "google":
        data.google_id = social_id;
        break;

      case "apple":
        data.apple_id = social_id;
        break;

      case "facebook":
        data.fb_id = social_id;
        break;

      default:
        data.google_id = social_id;
        break;
    }
    const isUserExists = await accounts.findOne({ where: data });
    if (!isUserExists) {
      return res
        .status(errorsHelper.notFound)
        .json(
          await errorsHelper.NotFound(
            false,
            "Invalid social id!",
            "User's social sign-in API."
          )
        );
    }
    if (isUserExists.deleted_at != null) {
      const data = { is_deleted: true };
      return res
        .status(errorsHelper.conflict)
        .json(
          await errorsHelper.Conflict(
            "This account deleted by admin!",
            data,
            "User's social sign-in API."
          )
        );
    }
    if (isUserExists.is_blocked == 1) {
      const data = { is_blocked: true };
      return res
        .status(errorsHelper.conflict)
        .json(
          await errorsHelper.Conflict(
            "Your email id has blocked, please contact to admin!",
            data,
            "User's social sign-in API."
          )
        );
    }
    if (isUserExists.is_email_verify == 0) {
      const data = {
        user_id: isUserExists.id,
        social_id: social_id,
        email: isUserExists.email,
        social_type: social_type,
        is_email_verifyed: isUserExists.is_email_verify == 1 ? true : false,
      };
      return res
        .status(errorsHelper.conflict)
        .json(
          await errorsHelper.Conflict(
            "This social id associated email is not verifyed!",
            data,
            "User's social sign-in API."
          )
        );
    }

    const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
    const emailHash = isUserExists.user_hash;
    const refreshToken = jwt.sign({ _id: emailHash }, secret, {
      expiresIn: "24h",
    });
    const access_token = jwt.sign(
      { _id: emailHash },
      "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!",
      { expiresIn: "20m" }
    );
    ///checking mobile logined sessions
    const currentMobileLoginSessions = await userLogin.count({
      where: { account_id: isUserExists.id, fcm: { $ne: null } },
    });
    const allowedMobileLogins = isUserExists.allowed_login_in_mobile;
    if (currentMobileLoginSessions === allowedMobileLogins && fcm != "") {
      let logedinDevicesList = await userLogin.findAll({
        attributes: ["account_id", "fcm", "device_id", "device_name"],
        where: { account_id: isUserExists.id, fcm: { $ne: null } },
      });
      const data = {
        deviceList: logedinDevicesList,
        access_token: access_token,
      };
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            false,
            "Please logout from other device then login!",
            data,
            null,
            "User's social sign-in API."
          )
        );
    }
    /// checking web logined sessions
    const currentWebLoginSessions = await userLogin.count({
      where: { account_id: isUserExists.id, fcm: { [Op.ne]: null } },
    });
    const allowedWebLogins = isUserExists.allowed_logins_in_web;
    if (currentWebLoginSessions === allowedWebLogins && fcm == "") {
      let logedinDevicesList = await userLogin.findAll({
        attributes: ["account_id", "fcm", "device_id", "device_name"],
        where: { account_id: isUserExists.id, fcm: { [Op.ne]: null } },
      });
      logedinDevicesList.access_token = access_token;
      const data = {
        deviceList: logedinDevicesList,
        access_token: access_token,
      };
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            false,
            "Please logout from other device then login!",
            data,
            null,
            "User's social sign-in API."
          )
        );
    }

    let tokenData;

    const is_refresh_token_user_exists = await userLogin.findOne({
      where: { account_id: isUserExists.id, fcm: fcm, device_id: device_id },
    });
    if (is_refresh_token_user_exists) {
      const data = {
        token: refreshToken,
        language: language,
        device_name: device_name,
        updated_at: new Date(),
      };
      tokenData = await userLogin.update(data, {
        where: { account_id: isUserExists.id },
      });
    } else {
      const data = {
        account_id: isUserExists.id,
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
        id: isUserExists.id,
        user_id: isUserExists.user_id,
        email_id: isUserExists.email,
        mobile: isUserExists.mobile,
        profile_pic: isUserExists.profile_image,
        access_token: access_token,
        refresh_token: refreshToken,
        is_email_verifyed: isUserExists.is_email_verify == 1 ? true : false,
        is_mobile_verifyed: isUserExists.is_mobile_verify == 1 ? true : false,
        is_first_password_changed:
          isUserExists.is_first_password_changed == 1 ? true : false,
        fcm: fcm,
        device_id: device_id,
        language: language,
      };

      const is_user_exists_in_user_details = await userDetails.findOne({
        where: { language: language, account_id: isUserExists.id },
      });
      if (!is_user_exists_in_user_details) {
        const userDetailsData = {
          account_id: isUserExists.id,
          name: isUserExists.name,
          mobile: isUserExists.mobile,
          email: isUserExists.email,
          country_code: isUserExists.country_code,
          user_id: isUserExists.user_id,
          language: isUserExists.language,
          dob: isUserExists.dob,
        };
        console.log("<<<<userDetailsData>>>>", userDetailsData);

        updateInUserDetails = await userDetails.create(userDetailsData);
      }
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            true,
            "User login successfully!",
            data,
            null,
            "User's social sign-in API."
          )
        );
    }
  } catch (error) {
    const data = {
      error: error.message,
      errorStack: error.stack,
    };
    await errorLogsCreator.writeLog(data);

    return res
      .status(errorsHelper.iSError)
      .json(
        await errorsHelper.ISError(error.message, "User's social sign-in API.")
      );
  }
};

module.exports.requestSocialOTP = async (req, res) => {
  try {
    let { social_id, user_id, email, social_type } = req.body;
    social_id = sanitizeHtml(social_id);
    user_id = sanitizeHtml(user_id);
    email = sanitizeHtml(email);
    social_type = sanitizeHtml(social_type);
    let updateOtp;

    const isUserExists = await accounts.findOne({ where: { id: user_id } });
    if (!isUserExists) {
      return res
        .status(errorsHelper.notFound)
        .json(
          await errorsHelper.NotFound(
            false,
            "This account does not exist!",
            "Request social OTP API."
          )
        );
    } else {
      let otp;

      otp = await commonHelper.genrateOTP();

      if (otp) {
        const emailReqData = {
          to: email,
          subject: "OTP for Email Verification",
          text: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Social ID hai Bhai</a>
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
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Social ID hai Bhai</a>
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
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            true,
            "OTP sent on your email id for social ID!",
            null,
            null,
            "Request social OTP API!"
          )
        );
    }
  } catch (error) {
    const data = {
      error: error.message,
      errorStack: error.stack,
    };

    await errorLogsCreator.writeLog(data);

    return res
      .status(errorsHelper.iSError)
      .json(
        await errorsHelper.ISError(error.message, "Request social OTP API!")
      );
  }
};

module.exports.verifySocialOTP = async (req, res) => {
  try {
    // throw new Error("Simulated 500 error occurred.");

    let {
      social_type,
      social_id,
      user_id,
      otp,
      fcm,
      device_id,
      ip_address,
      device_name,
      language,
    } = req.body;
    social_type = sanitizeHtml(social_type);
    social_id = sanitizeHtml(social_id);
    user_id = sanitizeHtml(user_id);
    otp = sanitizeHtml(otp);
    fcm = sanitizeHtml(fcm);
    device_id = sanitizeHtml(device_id);
    ip_address = sanitizeHtml(ip_address);
    device_name = sanitizeHtml(device_name);
    language = sanitizeHtml(language);
    const isUserExists1 = await accounts.findOne({ where: { id: user_id } });
    if (!isUserExists) {
      return res
        .status(errorsHelper.notFound)
        .json(
          await errorsHelper.NotFound(
            false,
            "Invalid user id!",
            "Verify social OTP API."
          )
        );
    }
    const existsOtp = await userOTP.findOne({
      where: { account_id: isUserExists.id, otp: otp },
    });
    if (!existsOtp) {
      return res
        .status(errorsHelper.notFound)
        .json(
          await errorsHelper.NotFound(
            false,
            "Invalid OTP!",
            "Verify social OTP API."
          )
        );
    }
    const currentTime = new Date();
    let isOtpExpired;
    await sequelize.transaction(async (t) => {
      isOtpExpired = await userOTP.findOne(
        {
          attributes: [
            [
              sequelize.literal(
                `created_at + interval 5 minute > '${currentTime.toISOString()}'`
              ),
              "is_valid",
            ],
          ],
          where: { account_id: isUserExists.id, otp: otp },
        },
        { transaction: t }
      );
    });
    if (isOtpExpired.dataValues.is_valid === 0) {
      return res
        .status(errorsHelper.gone)
        .json(
          await errorsHelper.Gone("OTP expired!", "Verify social OTP API.")
        );
    }

    const isUpdated = await accounts.update(
      { is_email_verify: 1 },
      { where: { id: user_id } }
    );

    const secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!";
    const emailHash = isUserExists.user_hash;
    const refreshToken = jwt.sign({ _id: emailHash }, secret, {
      expiresIn: "24h",
    });
    const access_token = jwt.sign(
      { _id: emailHash },
      "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!",
      { expiresIn: "20m" }
    );
    ///checking mobile logined sessions
    const currentMobileLoginSessions = await userLogin.count({
      where: { account_id: isUserExists.id, fcm: { $ne: null } },
    });
    const allowedMobileLogins = isUserExists.allowed_login_in_mobile;
    if (currentMobileLoginSessions === allowedMobileLogins && fcm != "") {
      let logedinDevicesList = await userLogin.findAll({
        attributes: ["account_id", "fcm", "device_id", "device_name"],
        where: { account_id: isUserExists.id, fcm: { $ne: null } },
      });
      const data = {
        deviceList: logedinDevicesList,
        access_token: access_token,
      };
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            false,
            "Please logout from other device then login!",
            data,
            null,
            "User's social sign-in API!"
          )
        );
    }
    /// checking web logined sessions
    const currentWebLoginSessions = await userLogin.count({
      where: { account_id: isUserExists.id, fcm: { [Op.ne]: null } },
    });
    const allowedWebLogins = isUserExists.allowed_logins_in_web;
    if (currentWebLoginSessions === allowedWebLogins && fcm == "") {
      let logedinDevicesList = await userLogin.findAll({
        attributes: ["account_id", "fcm", "device_id", "device_name"],
        where: { account_id: isUserExists.id, fcm: { [Op.ne]: null } },
      });
      logedinDevicesList.access_token = access_token;
      const data = {
        deviceList: logedinDevicesList,
        access_token: access_token,
      };
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            false,
            "Please logout from other device then login!",
            data,
            null,
            "User's social sign-in API!"
          )
        );
    }

    let tokenData;

    const is_refresh_token_user_exists = await userLogin.findOne({
      where: { account_id: isUserExists.id, fcm: fcm, device_id: device_id },
    });
    if (is_refresh_token_user_exists) {
      const data = {
        token: refreshToken,
        language: language,
        device_name: device_name,
        updated_at: new Date(),
      };
      tokenData = await userLogin.update(data, {
        where: { account_id: isUserExists.id },
      });
    } else {
      const data = {
        account_id: isUserExists.id,
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

    if (isUpdated == 1) {
      if (access_token) {
        const isVerifiedData = {
          id: isUserExists.id,
          user_id: isUserExists.user_id,
          email_id: isUserExists.email,
          mobile: isUserExists.mobile,
          profile_pic: isUserExists.profile_image,
          access_token: access_token,
          refresh_token: refreshToken,
          is_email_verifyed: true,
          is_mobile_verifyed: isUserExists.is_mobile_verify == 1 ? true : false,
          is_first_password_changed:
            isUserExists.is_first_password_changed == 1 ? true : false,
          fcm: fcm,
          device_id: device_id,
          language: language,
        };
        return res
          .status(errorsHelper.oK)
          .json(
            await errorsHelper.OK(
              true,
              "User login successfully!",
              isVerifiedData,
              null,
              "User's social sign-in API!"
            )
          );
      }
    }

    if (access_token) {
      const isVerifiedNotData = {
        id: isUserExists.id,
        user_id: isUserExists.user_id,
        email_id: isUserExists.email,
        mobile: isUserExists.mobile,
        profile_pic: isUserExists.profile_image,
        access_token: access_token,
        refresh_token: refreshToken,
        is_email_verifyed: false,
        is_mobile_verifyed: isUserExists.is_mobile_verify == 1 ? true : false,
        is_first_password_changed:
          isUserExists.is_first_password_changed == 1 ? true : false,
        fcm: fcm,
        device_id: device_id,
        language: language,
      };
      return res
        .status(errorsHelper.oK)
        .json(
          await errorsHelper.OK(
            true,
            "User login successfully!",
            isVerifiedNotData,
            null,
            "User's social sign-in API!"
          )
        );
    }
  } catch (error) {
    const data = {
      error: error.message,
      errorStack: error.stack,
    };
    await errorLogsCreator.writeLog(data);

    return res
      .status(errorsHelper.iSError)
      .json(
        await errorsHelper.ISError(error.message, "User's social sign-in API!")
      );
  }
};
