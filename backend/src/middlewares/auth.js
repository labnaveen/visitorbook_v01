require("dotenv").config();
const jwt = require("jsonwebtoken");
const accounts = require("../models/accountsModel");
const userLogin = require("../models/userLoginModel");
const employees = require("../models/employeeModel");
const errorsHelper = require("../helpers/ErrorHelper");

module.exports.authenticate = () => {
    return async function (req, res, next) {
        try {
            let token, fcm;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (req.headers.fcm) {
                fcm = req.headers.fcm;
            }
            if (fcm == undefined) {
                fcm = "";
            }

            if (token) {
                let secret = process.env.JWT_SECRET;
                // console.log(">>>>>>>>>>>>secret: ", secret)
                const verifyUser = jwt.verify(token, secret);
                // console.log('verifyUser:<<>>: ', verifyUser)
                const emailHash = verifyUser._id;
                // console.log("EMAIL HASH<><><", emailHash)
                // console.log("verifyUser.roleId <><><", verifyUser.roleId )
                const isExistsUser = await employees.findOne({ where: { id: emailHash, role_id: verifyUser.roleId } });
                // console.log('isExistsUser:<<>>: ', isExistsUser)
                const isRefreshTokenValid = await userLogin.findOne({ where: { account_id: emailHash } });
                // console.log('isRefreshTokenValid:<<>>: ', isRefreshTokenValid)
                if (!isRefreshTokenValid) {
                    return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Your session has expired, Please login again!", "Authorization middleware check!"));
                }
                if (isExistsUser) {
                    req.credentials = { id: isExistsUser.id, email: isExistsUser.email, fcm: fcm, role: isExistsUser.role_id, companyId: isExistsUser.company_id };
                    next();
                } else {
                    return res.status(errorsHelper.forbidden).json(await errorsHelper.UnAuthorized("Unauthorized, must be access token!", "Authorization middleware check!"));
                }
            } else {
                return res.status(errorsHelper.forbidden).json(await errorsHelper.UnAuthorized("Unauthorized, must be access token!!", "Authorization middleware check!"));
            }
        } catch (e) {
            console.log("e>eeeeeeeeeee>>>>>>:", e);
            return res.status(errorsHelper.forbidden).json(await errorsHelper.UnAuthorized("Unauthorized, must be access token!!!", "Authorization middleware check!"));
        }
    };
};

module.exports.authenticateWITHOUTRefreshToken = () => {
    return async function (req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (token) {
                let secret = process.env.JWT_SECRET;
                secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!"; /// its only needed when unit test
                const verifyUser = jwt.verify(token, secret);
                console.log("verifyUser without refresh token:<<>>: ", verifyUser);
                const emailHash = verifyUser._id;
                console.log("EMAIL");
                const isExistsUser = await accounts.findOne({ where: { email_hash: emailHash } });
                console.log("isExistsUser:<<>>: ", isExistsUser);
                if (isExistsUser) {
                    req.credentials = { id: isExistsUser.id, email: isExistsUser.email_id };
                    next();
                } else {
                    return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Your session has expired, Please login again!", "Authorization middleware check!"));
                }
            } else {
                return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
            }
        } catch (e) {
            // console.log('e>eeeeeeeeeee>>>>>>:',e)
            return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
        }
    };
};

module.exports.adminAuthenticate = () => {
    return async function (req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (token) {
                let secret = process.env.JWT_SECRET;
                secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!"; /// its only needed when unit test
                const verifyUser = jwt.verify(token, secret);
                // console.log('verifyUser:<<>>: ', verifyUser)
                const emailHash = verifyUser._id;
                const isExistsUser = await tbluserdetails.findOne({ where: { user_email_hash: emailHash, role: "admin" } });
                // console.log('isExistsUser:<<>>: ', isExistsUser)
                const refreshTokenDetails = await tblrefreshtokens.findOne({ where: { user_id: isExistsUser.id, is_expired: 0 } });
                try {
                    const isRefreshTokenValid = jwt.verify(refreshTokenDetails.refresh_token, secret);
                    console.log("isRefreshTokenValid:<<>>: ", isRefreshTokenValid);
                } catch (error) {
                    return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Your session has expired, Please login again!", "Authorization middleware check!"));
                }
                if (isExistsUser) {
                    req.credentials = { id: isExistsUser.id, email: isExistsUser.email_id };
                    next();
                } else {
                    return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
                }
            } else {
                return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
            }
        } catch (e) {
            // console.log('e>eeeeeeeeeee>>>>>>:',e)
            return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
        }
    };
};

module.exports.adminAuthenticateNoRefreshToken = () => {
    return async function (req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (token) {
                let secret = process.env.JWT_SECRET;
                secret = "qwertasdfgzxcvb!@#1234567890)(*&^%$#@!"; /// its only needed when unit test
                const verifyUser = jwt.verify(token, secret);
                console.log("verifyUser without refresh token:<<>>: ", verifyUser);
                const emailHash = verifyUser._id;
                const isExistsUser = await tbluserdetails.findOne({ where: { user_email_hash: emailHash, role: "admin" } });
                console.log("isExistsUser:<<>>: ", isExistsUser);
                if (isExistsUser) {
                    req.credentials = { id: isExistsUser.id, email: isExistsUser.email_id };
                    next();
                } else {
                    return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Your session has expired, Please login again!", "Authorization middleware check!"));
                }
            } else {
                return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
            }
        } catch (e) {
            // console.log('e>eeeeeeeeeee>>>>>>:',e)
            return res.status(errorsHelper.forbidden).json(await errorsHelper.Forbidden("Unauthorized, must be access token!", "Authorization middleware check!"));
        }
    };
};
