const sanitizeHtml = require("sanitize-html");
const ResponseHelper = require("../helpers/ResponseHelper");
const Companies = require("../models/companiesModel");
const bcrypt = require("bcrypt");
const Departments = require("../models/departmentsModel");
const CompanyCheckInDetails = require("../models/companyCheckInMapModel");
const Employees = require("../models/employeeModel");
const { sequelize } = require("../config/db.config");
const Constants = require("../constants/Constants");
const { Op } = require("sequelize");
const PasswordRecovery = require("../models/passwordRecoveryModel");
const CommonHelper = require("../helpers/CommonHelper");
const CompanyPackageDetails = require("../models/companyPackageDetailsModel");
const RazorPaySubscriptionAndPackageMap = require("../models/razorPaySubscriptionAndPackageMapModel");

module.exports.addCheckinCredentials = async (req, res) => {
    try {
        let { id } = req.credentials;
        let { check_in_email, check_in_password, role_id } = req.body;

        check_in_email = sanitizeHtml(check_in_email);
        check_in_password = sanitizeHtml(check_in_password);

        if (role_id != Constants?.UserRoles?.admin) {
            return await ResponseHelper.UnAuthorized(res, "Only admins can add check-in credentials!", "Add Check In Credentials API!");
        }

        const employeeData = await Employees.findOne({
            where: {
                id: id,
            },
        });

        let company_id = employeeData?.company_id;

        const existingCompanyCheckIn = await CompanyCheckInDetails.findOne({
            where: { company_id },
        });

        if (existingCompanyCheckIn) {
            return await ResponseHelper.BadRequest(res, "Not more than one check-in credentials are allowed!", "Add Check In Credentials API!");
        }

        const existingCheckIn = await CompanyCheckInDetails.findOne({
            where: { check_in_email: check_in_email },
        });

        if (existingCheckIn) {
            return await ResponseHelper.BadRequest(res, "Check-in email already exists!", "Add Check In Credentials API!");
        }

        const hashedCheckInPassword = await bcrypt.hash(check_in_password, 10);

        const companyData = await Companies.findOne({ where: { id: company_id } });
        const departmentData = await Departments.findOne({ where: { company_id } });

        const checkinCredentialsLoginData = {
            check_in_email,
            check_in_password: hashedCheckInPassword,
            company_id,
        };

        await sequelize.transaction(async (t) => {
            const isUserCheckedIn = await CompanyCheckInDetails.create(checkinCredentialsLoginData, { transaction: t });

            const checkInDetails = {
                firstname: companyData?.name,
                middlename: "",
                lastname: "",
                phone_prefix: "",
                phone: "",
                email: check_in_email,
                password: hashedCheckInPassword,
                department_id: departmentData?.id,
                gender: "",
                company_id,
                role_id: 3,
                picture: "",
                is_check_in_login: true,
            };
            if (isUserCheckedIn) {
                await Employees.create(checkInDetails, { transaction: t });
            }
        });

        return await ResponseHelper.Created(res, true, "Check-in credentials added successfully!", null, null, "Add Check In Credentials API!");
    } catch (error) {
        console.log("ERRRRRRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!11", error);
        return await ResponseHelper.ISError(res, error.message, "Add Check In Credentials API!");
    }
};

module.exports.updateCheckinCredentials = async (req, res) => {
    try {
        let { old_check_in_email, check_in_email, check_in_password, company_id } = req.body;

        old_check_in_email = sanitizeHtml(old_check_in_email);
        check_in_email = sanitizeHtml(check_in_email);
        check_in_password = sanitizeHtml(check_in_password);
        company_id = sanitizeHtml(company_id);

        const existingCheckIn = await CompanyCheckInDetails.findOne({
            where: { check_in_email: old_check_in_email, company_id },
        });

        if (!existingCheckIn) {
            return await ResponseHelper.BadRequest(res, "Check-in credentials not found!", "Update Check In Credentials API!");
        }

        const employee = await Employees.findOne({
            where: { email: old_check_in_email, company_id },
        });

        if (!employee) {
            return await ResponseHelper.BadRequest(res, "Employee record not found!", "Update Check In Credentials API!");
        }

        if (old_check_in_email != check_in_email) {
            const emailExists = await CompanyCheckInDetails.findOne({
                where: { check_in_email: check_in_email, company_id: company_id },
            });

            if (emailExists) {
                return await ResponseHelper.BadRequest(res, "New email is already in use!", "Update Check In Credentials API!");
            }
        }
        const hashedCheckInPassword = check_in_password ? await bcrypt.hash(check_in_password, 10) : employee.password;

        await sequelize.transaction(async (t) => {
            await CompanyCheckInDetails.update({ check_in_email, check_in_password: hashedCheckInPassword }, { where: { check_in_email: old_check_in_email, company_id }, transaction: t });
            await Employees.update({ email: check_in_email, password: hashedCheckInPassword }, { where: { email: old_check_in_email, company_id }, transaction: t });
        });

        return await ResponseHelper.OK(res, true, "Check-in credentials updated successfully!", null, null, "Update Check In Credentials API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Update Check In Credentials API!");
    }
};
module.exports.getCheckInDetails = async (req, res) => {
    try {
        let { company_id } = req.params;
        company_id = sanitizeHtml(company_id);
        const checkInData = await CompanyCheckInDetails.findOne({
            where: {
                company_id: company_id,
            },
        });
        if (!checkInData) {
            return await ResponseHelper.BadRequest(res, "Check-in data not found!", "Get Check In Credentials Details API!");
        }
        return await ResponseHelper.OK(res, true, "Check-in details fetched successfully!", checkInData, null, "Get Check In Credentials Details API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Get Check In Credentials Details API!");
    }
};

module.exports.getCheckInDetailsList = async (req, res) => {
    try {
        let { company_id } = req.params;
        const query = req.query;
        const page = query.page ? parseInt(query.page) : 1;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search ? req.query.search.trim() : null;
        let searchWhere = {};
        if (searchTerm) {
            searchWhere[Op.or] = [{ check_in_email: { [Op.like]: `%${searchTerm}%` } }, { company_id: { [Op.like]: `%${searchTerm}%` } }];
        }
        company_id = sanitizeHtml(company_id);
        const { rows, count } = await CompanyCheckInDetails.findAndCountAll({
            offset,
            limit,
            where: { ...searchWhere, company_id: company_id },
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const meta = {
            totalCount: count,
            pageCount: totalPages,
            currentPage: page,
            perPage: limit,
            hasNextPage,
            hasPrevPage,
        };
        return await ResponseHelper.OK(res, true, "Check In list fetched succesfully !", rows, meta, "Get Check In Credentials List API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Get Check In Credentials List API!");
    }
};

module.exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Employees.findOne({
            where: {
                email: email,
                id: {
                    [Op.ne]: 0,
                },
            },
        });

        if (!user) {
            await ResponseHelper.Forbidden("Invalid Email", "Send OTP API!");
        }
        const currentDate = new Date(); // Current date and time
        const sent_at = currentDate.toISOString(); // Date with 5 minutes added in ISO format
        const expired_at = currentDate.setMinutes(currentDate.getMinutes() + 2); // Add 5 minutes

        const otp = await CommonHelper.genrateOTP();

        if (otp) {
            const otpRecovery = await PasswordRecovery.findOne({
                where: { user_id: user.id },
            });
            if (otpRecovery) {
                await PasswordRecovery.update(
                    {
                        otp: otp,
                        is_used: 0,
                        sent_at: sent_at,
                        expired_at: expired_at,
                    },
                    { where: { user_id: user.id } }
                );
            } else {
                const userTokenData = {
                    user_id: user.id,
                    is_used: 0,
                    sent_at: sent_at,
                    expired_at: expired_at,
                    otp: otp,
                };
                if (userTokenData) {
                    const createdUser = await PasswordRecovery.create(userTokenData);
                }
            }
        }
        let textBody = `Dear ${user.name},

We received a request to reset the password for your account. 

To reset your password, please enter the OTP: ${otp}.

If you did not request a password reset, please ignore this email.

Please note that this OTP is valid for 2 minutes only. If you do not reset your password within this time frame, you will need to request another password reset.

Thank you,`;

        // let html_body = `<html><head><title>Reset Your Password</title></head><body><p>Dear ${user.name},</p><p>We received a request to reset the password for your account. To reset your password, please enter the otp ${otp}</p><p>If you did not request a password reset, please ignore this email.</p><p>Please note that this otp is valid for 2 minutes only. If you do not reset your password within this time frame, you will need to request another password reset.</p><p>Thank you,</p><p>Cuppanord</p></body></html>`;
        let body = {
            to: email,
            subject: "Otp send for email verification to reset password",
            // html_body: html_body,
            body: textBody,
        };
        const reset_email = await CommonHelper.sendOTPOnEmail(body);

        return await ResponseHelper.OK(res, true, "OTP has been sent to your Email successfully!", { otp }, null, "Send OTP API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Send OTP API!");
    }
};
module.exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Find the user by ID and update their profile
        const user = await Employees.findOne({ where: { email: email } });

        if (!user) {
            await ResponseHelper.Forbidden("Invalid Email", "Verify OTP API!");
        }

        const userPasswordRecoveryData = await PasswordRecovery.findOne({
            where: { user_id: user.id },
        });

        if (!userPasswordRecoveryData) {
            await ResponseHelper.UnAuthorized("Invalid User!", "Verify OTP API!");
        }
        if (userPasswordRecoveryData.otp != otp) {
            await ResponseHelper.UnAuthorized("Invalid OTP!", "Verify OTP API!");
        }

        const currentDate = new Date(); // Current date and time
        const expire_time = currentDate.toISOString(); // Date with 5 minutes added in ISO format

        const expiredAtDate = new Date(userPasswordRecoveryData.expired_at).toISOString();

        if (expiredAtDate < expire_time) {
            await ResponseHelper.UnAuthorized("OTP Expired!", "Verify OTP API!");
        }

        return await ResponseHelper.OK(res, true, "OTP verified successfully!", null, null, "Verify OTP API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Verify OTP API!");
    }
};

// module.exports.getFeaturesList = async (req, res) => {
//     try {
//         let { company_id } = req.params;
//         company_id = sanitizeHtml(company_id);
//         const featuresData = await CompanyPackageDetails.findOne({
//             where: {
//                 company_id: company_id,
//             },
//         });
//         if (!featuresData) {
//             return await ResponseHelper.BadRequest(res, "Features not found for this company!", "Features List API!");
//         }
//         return await ResponseHelper.OK(res, true, "Features fetched successfully!", featuresData, null, "Features List API!");
//     } catch (error) {
//         return await ResponseHelper.ISError(res, error.message, "Features List API!");
//     }
// };

module.exports.getFeaturesList = async (req, res) => {
    try {
        let { company_id, package_id } = req.query;
        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);
        const featuresData = await RazorPaySubscriptionAndPackageMap.findOne({
            where: {
                company_id: company_id,
                package_id: package_id,
            },
        });
        if (!featuresData) {
            return await ResponseHelper.BadRequest(res, "Features not found for this company!", "Features List API!");
        }
        return await ResponseHelper.OK(res, true, "Features fetched successfully!", featuresData, null, "Features List API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Features List API!");
    }
};

module.exports.getFetauresValue = async (req, res) => {
    try {
        let { company_id, package_id } = req.query;
        company_id = sanitizeHtml(company_id);
        package_id = sanitizeHtml(package_id);
        const featuresData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
                package_id: package_id,
            },
        });
        if (!featuresData) {
            return await ResponseHelper.BadRequest(res, "Features not found for this company!", "Features List API!");
        }
        return await ResponseHelper.OK(res, true, "Features fetched successfully!", featuresData, null, "Features List API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Features List API!");
    }
};

module.exports.getFetauresListForVisitorModule = async (req, res) => {
    try {
        let { company_id } = req.params;
        company_id = sanitizeHtml(company_id);
        // package_id = sanitizeHtml(package_id);
        const featuresData = await CompanyPackageDetails.findOne({
            where: {
                company_id: company_id,
                // package_id: package_id,
            },
        });
        if (!featuresData) {
            return await ResponseHelper.BadRequest(res, "Features not found for this company!", "Features List API!");
        }
        return await ResponseHelper.OK(res, true, "Features fetched successfully!", featuresData, null, "Features List API!");
    } catch (error) {
        return await ResponseHelper.ISError(res, error.message, "Features List API!");
    }
};
