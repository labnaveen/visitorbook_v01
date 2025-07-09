const jwt = require("jsonwebtoken");
const userLogin = require("../models/userLoginModel");
const commonHelper = require("../helpers/CommonHelper");
const sequelize = require("../config/db.config").sequelize;
const sanitizeHtml = require("sanitize-html");
const errorsHelper = require("../helpers/ErrorHelper");
const errorLogsCreator = require("../helpers/ErrorLogsCreator");
const Visitors = require("../models/visiitorModel");
const companies = require("../models/companiesModel");
const employees = require("../models/employeeModel");
const UpdateEmployeeDetails = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const PasswordRecovery = require("../models/passwordRecoveryModel");
const { Sequelize, Op } = require("sequelize");
const { SnowDeviceManagement } = require("aws-sdk");
const ResponseHelper = require("../helpers/ResponseHelper");
const Departments = require("../models/departmentsModel");
const { response } = require("express");
const { restart } = require("nodemon");
const AppSettings = require("../models/appSettingsModel");
const { appSettingsSchema } = require("../JoiValidations/adminJoiSchema");
const Roles = require("../models/rolesModel");
require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const Constants = require("../constants/Constants");
const PackageDetails = require("../models/packageDetailsModel");
const Companies = require("../models/companiesModel");
const CompanyCheckInDetails = require("../models/companyCheckInMapModel");
const CompanyPackageDetails = require("../models/companyPackageDetailsModel");
const Package = require("../models/packageModel");
const RazorPaySubscription = require("../models/razorPaySubscriptionModel");
const RazorPaySubscriptionAndPackageMap = require("../models/razorPaySubscriptionAndPackageMapModel");
const { log } = require("console");

class AdminController {
    async adminAuthenticate(req, res, next) {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (token) {
                let secret = process.env.JWT_SECRET;
                const verifyUser = jwt.verify(token, secret);
                const emailHash = verifyUser._id;
                const isExistsUser = await tbluserdetails.findOne({ where: { user_email_hash: emailHash, role: "admin" } });
                const refreshTokenDetails = await tblrefreshtokens.findOne({ where: { user_id: isExistsUser.id, is_expired: 0 } });
                try {
                    const isRefreshTokenValid = jwt.verify(refreshTokenDetails.refresh_token, secret);
                } catch (error) {
                    return res.status(401).json({
                        success: false,
                        status: 401,
                        message: "Your session has expired, Please login again!",
                        error: error.message,
                        purpose: "Authorization API",
                    });
                }
                if (isExistsUser) {
                    req.credentials = { id: isExistsUser.id, email: isExistsUser.email_id };
                    next();
                } else {
                    return res.status(450).json({
                        success: false,
                        status: 450,
                        message: "Unauthorized, must be access token!",
                        error: null,
                        purpose: "Authorization API",
                    });
                }
            } else {
                return res.status(450).json({
                    success: false,
                    status: 450,
                    message: "Auth required, must be access token!",
                    error: null,
                    purpose: "Authorization API",
                });
            }
        } catch (e) {
            return res.status(450).json({
                success: false,
                status: 450,
                message: "Unauthorized, must be access token!",
                error: e.message,
                purpose: "Authorization API",
            });
        }
    }

    // async getVisitorList(req, res) {
    //     try {
    //         const { companyId } = req.params;
    //         let { name, phone_prefix, employee_id, phone, email, reason, company, vehicle_registration_number } = req.body;

    //         name = name ? sanitizeHtml(name) : null;
    //         employee_id = employee_id ? sanitizeHtml(employee_id) : null;
    //         phone_prefix = phone_prefix ? sanitizeHtml(phone_prefix) : null;
    //         phone = phone ? sanitizeHtml(phone) : null;
    //         email = email ? sanitizeHtml(email) : null;
    //         reason = reason ? sanitizeHtml(reason) : null;
    //         company = company ? sanitizeHtml(company) : null;
    //         vehicle_registration_number = vehicle_registration_number ? sanitizeHtml(vehicle_registration_number) : null;

    //         const query = req.query;
    //         const page = query.page ? parseInt(query.page) : 1;
    //         const limit = query.limit ? parseInt(query.limit) : 10;
    //         const offset = (page - 1) * limit;

    //         let { rows, count } = await Visitors.findAndCountAll({
    //             offset,
    //             limit,
    //             attributes: ["name", "company", "created_at"],
    //             order: [["created_at", "DESC"]],
    //             where: {
    //                 company_id: companyId,
    //             },

    //             include: {
    //                 model: employees,
    //                 attributes: [
    //                     "id",
    //                     [sequelize.fn("concat", sequelize.col("firstname"), " ", sequelize.col("middlename"), " ", sequelize.col("lastname")), "fullName"], // Concatenate firstname and lastname
    //                 ],
    //             },
    //         });
    //         const totalPages = Math.ceil(count / limit);
    //         const hasNextPage = page < totalPages;
    //         const hasPrevPage = page > 1;
    //         const meta = {
    //             totalCount: count,
    //             pageCount: totalPages,
    //             currentPage: page,
    //             perPage: limit,
    //             hasNextPage,
    //             hasPrevPage,
    //         };
    //         const updatedRows = rows.map((item) => ({
    //             ...item.dataValues,
    //         }));

    //         if (rows) {
    //             return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Visitors List successfully fetched!", updatedRows, meta, "Get Visitors List"));
    //         }
    //     } catch (error) {
    //         const data = {
    //             error: error.message,
    //             errorStack: error.stack,
    //         };
    //         await errorLogsCreator.writeLog(data);
    //         return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Get Visitors List API!"));
    //     }
    // }

    // async getVisitorList(req, res) {
    //     try {
    //         const { companyId } = req.params;
    //         let { name, phone_prefix, employee_id, phone, email, reason, company, vehicle_registration_number } = req.body;

    //         name = name ? sanitizeHtml(name) : null;
    //         employee_id = employee_id ? sanitizeHtml(employee_id) : null;
    //         phone_prefix = phone_prefix ? sanitizeHtml(phone_prefix) : null;
    //         phone = phone ? sanitizeHtml(phone) : null;
    //         email = email ? sanitizeHtml(email) : null;
    //         reason = reason ? sanitizeHtml(reason) : null;
    //         company = company ? sanitizeHtml(company) : null;
    //         vehicle_registration_number = vehicle_registration_number ? sanitizeHtml(vehicle_registration_number) : null;

    //         const query = req.query;
    //         const page = query.page ? parseInt(query.page) : 1;
    //         const limit = query.limit ? parseInt(query.limit) : 10;
    //         const offset = (page - 1) * limit;

    //         let { start_date, end_date, start_time, end_time } = req.query;
    //         let whereCondition = { company_id: companyId };

    //         // if (start_date && end_date) {
    //         //     let startDateTime = new Date(start_date);
    //         //     let endDateTime = new Date(end_date);

    //         //     endDateTime.setHours(23, 59, 59, 999);

    //         //     whereCondition["$Visitors.created_at$"] = {
    //         //         [Op.between]: [startDateTime, endDateTime],
    //         //     };
    //         // } else if (start_date) {
    //         //     let startDateTime = new Date(start_date);
    //         //     let endDateTime = new Date(start_date);
    //         //     endDateTime.setHours(23, 59, 59, 999);

    //         //     whereCondition["$Visitors.created_at$"] = {
    //         //         [Op.between]: [startDateTime, endDateTime],
    //         //     };
    //         // } else if (end_date) {
    //         //     let endDateTime = new Date(end_date);
    //         //     endDateTime.setHours(23, 59, 59, 999);

    //         //     whereCondition["$Visitors.created_at$"] = {
    //         //         [Op.lte]: endDateTime,
    //         //     };
    //         // }
    //         // if (start_time && end_time && start_date && end_date) {
    //         //     let startDateTime = new Date(`${start_date} ${start_time}`);
    //         //     let endDateTime = new Date(`${end_date} ${end_time}`);

    //         //     whereCondition["$Visitors.created_at$"] = {
    //         //         [Op.between]: [startDateTime, endDateTime],
    //         //     };
    //         // }

    //         if (start_date && end_date) {
    //             let startDateTime = new Date(start_date);
    //             let endDateTime = new Date(end_date);

    //             // Set date part
    //             startDateTime.setHours(0, 0, 0, 0);
    //             endDateTime.setHours(23, 59, 59, 999);

    //             // If time is also provided, update the hours/minutes
    //             if (start_time) {
    //                 const [startHours, startMinutes] = start_time.split(":").map(Number);
    //                 startDateTime.setHours(startHours, startMinutes, 0, 0);
    //             }
    //             if (end_time) {
    //                 const [endHours, endMinutes] = end_time.split(":").map(Number);
    //                 endDateTime.setHours(endHours, endMinutes, 59, 999);
    //             }

    //             whereCondition["created_at"] = {
    //                 [Op.between]: [startDateTime, endDateTime],
    //             };
    //         }

    //         let { rows, count } = await Visitors.findAndCountAll({
    //             offset,
    //             limit,
    //             attributes: ["name", "company", "created_at"],
    //             order: [["created_at", "DESC"]],
    //             where: whereCondition,
    //             include: {
    //                 model: employees,
    //                 attributes: ["id", [sequelize.fn("concat", sequelize.col("firstname"), " ", sequelize.col("middlename"), " ", sequelize.col("lastname")), "fullName"]],
    //             },
    //         });

    //         const totalPages = Math.ceil(count / limit);
    //         const hasNextPage = page < totalPages;
    //         const hasPrevPage = page > 1;
    //         const meta = {
    //             totalCount: count,
    //             pageCount: totalPages,
    //             currentPage: page,
    //             perPage: limit,
    //             hasNextPage,
    //             hasPrevPage,
    //         };

    //         if (rows.length > 0) {
    //             return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Visitors List successfully fetched!", rows, meta, "Get Visitors List"));
    //         } else {
    //             return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "No visitors found!", [], meta, "Get Visitors List"));
    //         }
    //     } catch (error) {
    //         console.error("Error in getVisitorList:", error);
    //         const data = {
    //             error: error.message,
    //             errorStack: error.stack,
    //         };
    //         await errorLogsCreator.writeLog(data);
    //         return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Get Visitors List API!"));
    //     }
    // }

    async getVisitorList(req, res) {
        try {
            const { companyId } = req.params;
            let { name, phone_prefix, employee_id, phone, email, reason, company, vehicle_registration_number } = req.body;

            // Sanitize input fields
            name = name ? sanitizeHtml(name) : null;
            employee_id = employee_id ? sanitizeHtml(employee_id) : null;
            phone_prefix = phone_prefix ? sanitizeHtml(phone_prefix) : null;
            phone = phone ? sanitizeHtml(phone) : null;
            email = email ? sanitizeHtml(email) : null;
            reason = reason ? sanitizeHtml(reason) : null;
            company = company ? sanitizeHtml(company) : null;
            vehicle_registration_number = vehicle_registration_number ? sanitizeHtml(vehicle_registration_number) : null;

            const query = req.query;
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;

            let { start_date, end_date, start_time, end_time } = req.query;
            let whereCondition = { company_id: companyId };

            if (start_date && end_date) {
                const startDateTime = new Date(start_date);
                const endDateTime = new Date(end_date);

                // Force time to midnight initially
                startDateTime.setHours(0, 0, 0, 0);
                endDateTime.setHours(23, 59, 59, 999);

                if (start_time) {
                    const [startHours, startMinutes, startSeconds] = start_time.split(":").map(Number);
                    startDateTime.setHours(startHours, startMinutes, startSeconds || 0, 0);
                }

                if (end_time) {
                    const [endHours, endMinutes, endSeconds] = end_time.split(":").map(Number);
                    endDateTime.setHours(endHours, endMinutes, endSeconds || 59, 999);
                }

                whereCondition["created_at"] = {
                    [Op.between]: [startDateTime, endDateTime],
                };
            }

            // Fetch paginated visitor data
            let { rows, count } = await Visitors.findAndCountAll({
                offset,
                limit,
                // attributes: ["name", "company", "created_at"],
                order: [["created_at", "DESC"]],
                where: whereCondition,
                include: {
                    model: employees,
                    attributes: ["id", [sequelize.fn("concat", sequelize.col("firstname"), " ", sequelize.col("middlename"), " ", sequelize.col("lastname")), "fullName"]],
                },
            });

            // Pagination metadata
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

            if (rows.length > 0) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Visitors List successfully fetched!", rows, meta, "Get Visitors List"));
            } else {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "No visitors found!", [], meta, "Get Visitors List"));
            }
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Get Visitors List API!"));
        }
    }

    async getCompaniesList(req, res) {
        try {
            let { code, name, address, picture, status } = req.body;
            let { payment_status } = req.query;
            const { id, role } = req.credentials;

            code = sanitizeHtml(code);
            name = sanitizeHtml(name);
            address = sanitizeHtml(address);
            picture = sanitizeHtml(picture);
            status = sanitizeHtml(status);

            const query = req.query;
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;

            let whereCondition = {};
            if (payment_status !== undefined && (payment_status == 0 || payment_status == 1)) {
                whereCondition.payment_status = parseInt(payment_status); // Ensure status is an integer
            }

            let { rows, count } = await companies.findAndCountAll({
                where: whereCondition,
                offset,
                limit,
                order: [["created_at", "DESC"]],
                attributes: ["id", "name", "address", "status", "picture", "code", "payment_status", "created_at"],
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
            const updatedRows = rows.map((item) => ({
                ...item.dataValues,
                is_blocked: item.status == 0,
            }));

            if (rows) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Companies List!", updatedRows, meta, "Get all companies"));
            }
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                error: "Error occurred while fetching company details.",
            });
        }
    }

    async uploadCompanyLogo(req, res) {
        try {
            let {
                // fieldname,
                originalname,
                // encoding,
                // mimetype,
                // destination,
                filename,
                // path,
                // size,
            } = req.file;

            // const { id } = req.credentials;
            const currenttime = new Date().getTime();
            const fName = `${currenttime}_${originalname}`;
            const logoURL = process.env.LOGO_URL;
            const data = {
                fileName: fName,
                file: req.file,
            };
            // const uploadDetails = await commonHelper.upload_aws(data);
            const url = `${logoURL}/${filename}`;
            const resData = {
                url: url,
                imageName: filename,
            };
            if (resData) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Image uploaded successfully!", resData, null, "Upload image API!"));
            }
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);

            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Upload image API!"));
        }
    }

    async addNewCompanies(req, res) {
        try {
            let { name, address, image, gender, adminEmail, adminPassword, checkInEmail, checkInPassword, package_id, duration, comment } = req.body;
            const { id, role } = req.credentials;

            name = sanitizeHtml(name);
            address = sanitizeHtml(address);
            image = sanitizeHtml(image);
            gender = sanitizeHtml(gender);
            adminEmail = sanitizeHtml(adminEmail);
            adminPassword = sanitizeHtml(adminPassword);
            checkInEmail = sanitizeHtml(checkInEmail);
            package_id = sanitizeHtml(package_id);
            duration = sanitizeHtml(duration);
            comment = sanitizeHtml(comment);

            const isCompanyAdminExists = await employees.findOne({
                where: {
                    email: adminEmail,
                    role_id: 2,
                },
            });
            if (isCompanyAdminExists) {
                return await ResponseHelper.Conflict(res, "Admin email id already exists !", null, "Add Company details!");
            }
            const isCompanyCheckInUserExists = await employees.findOne({
                where: {
                    email: checkInEmail,
                    role_id: 3,
                },
            });
            if (isCompanyCheckInUserExists) {
                return await ResponseHelper.Conflict(res, "Check-in email id already exists !", null, "Add Company details!");
            }
            const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
            const hashedcheckInPassword = await bcrypt.hash(checkInPassword, 10);
            const randomCode = await commonHelper.generateTempPassword(6);
            const newCompanyData = {
                name: name,
                address: address,
                picture: image,
                code: randomCode,
                status: 1,
                payment_status: 1,
                package_id: package_id,
                duration: duration,
                comment: comment,
            };
            let addCompany, addAdminDetails, addCheckInDetails;
            await sequelize.transaction(async (t) => {
                addCompany = await companies.create(newCompanyData, { transaction: t });

                const departmentsDetails = {
                    name: "admin",
                    display_name: "Admin",
                    color: "#ffffff",
                    company_id: addCompany.id,
                };
                const insertedDepartmentData = await Departments.create(departmentsDetails);
                const adminDetails = {
                    firstname: name,
                    middlename: "",
                    lastname: "",
                    phone_prefix: "",
                    phone: "",
                    email: adminEmail,
                    password: hashedAdminPassword,
                    department_id: insertedDepartmentData.id,
                    gender: gender,
                    company_id: addCompany.id,
                    role_id: 2,
                    picture: "",
                };
                addAdminDetails = await employees.create(adminDetails, { transaction: t });
                const checkInDetails = {
                    firstname: name,
                    middlename: "",
                    lastname: "",
                    phone_prefix: "",
                    phone: "",
                    email: checkInEmail,
                    password: hashedcheckInPassword,
                    department_id: insertedDepartmentData.id,
                    gender: gender,
                    company_id: addCompany.id,
                    role_id: 3,
                    picture: "",
                    is_check_in_login: 1,
                };

                addCheckInDetails = await employees.create(checkInDetails, { transaction: t });

                const checkinData = {
                    company_id: addCompany.id,
                    check_in_email: checkInEmail,
                    check_in_password: hashedcheckInPassword,
                };

                await CompanyCheckInDetails.create(checkinData, { transaction: t });

                const packageData = await Package.findOne({
                    where: {
                        id: package_id,
                    },
                });

                const validityInDays = packageData?.validity_in_days || 0;

                const durationInDays = duration ? parseInt(duration) * 30 : 0;

                const totalValidityDays = validityInDays + durationInDays;

                const nextPaymentDate = new Date();
                nextPaymentDate.setDate(nextPaymentDate.getDate() + totalValidityDays);

                const year = nextPaymentDate.getFullYear();
                const month = String(nextPaymentDate.getMonth() + 1).padStart(2, "0");
                const day = String(nextPaymentDate.getDate()).padStart(2, "0");

                const formattedNextPaymentDate = `${year}-${month}-${day}`;

                const subscriptionDataForCompany = {
                    plan_id: "Not Available",
                    subscription_id: "Not Available",
                    customer_id: "Not Available",
                    subscription_status_id: 3,
                    package_id: package_id,
                    company_id: addCompany?.id,
                    package_name: packageData?.package_name,
                    package_price: packageData?.package_price,
                    validity_in_days: packageData?.validity_in_days,
                    user_base: packageData?.user_base,
                    next_payment_date: formattedNextPaymentDate,
                    susbscription_type: 1,
                };

                await RazorPaySubscription.create(subscriptionDataForCompany, { transaction: t });

                const packageInfo = await PackageDetails.findOne({
                    where: {
                        package_id: package_id,
                    },
                });

                const mappedData = {
                    package_id: package_id,
                    company_id: addCompany?.id,
                    subscription_id: "Not Available",
                    is_camera_visible: packageInfo?.is_camera_visible,
                    is_id_proof_visible: packageInfo?.is_id_proof_visible,
                    is_wifi_checkbox_visible: packageInfo?.is_wifi_checkbox_visible,
                    is_car_parking_visible: packageInfo?.is_car_parking_visible,
                    is_display_visitor_card_visible: packageInfo?.is_display_visitor_card_visible,
                    is_print_visitor_card_visible: packageInfo?.is_print_visitor_card_visible,
                    is_data_export_available: packageInfo?.is_data_export_available,
                    is_digital_log_visible: packageInfo?.is_digital_log_visible,
                    is_report_export_available: packageInfo?.is_report_export_available,
                };

                const existingRecord = await RazorPaySubscriptionAndPackageMap.findOne({
                    where: {
                        company_id: addCompany?.id,
                        package_id: package_id,
                    },
                    transaction: t,
                });

                if (existingRecord) {
                    await existingRecord.update(mappedData, { transaction: t });
                } else {
                    await RazorPaySubscriptionAndPackageMap.create(mappedData, { transaction: t });
                }

                const checkCheckinExists = await CompanyCheckInDetails.findOne({
                    where: {
                        company_id: addCompany?.id,
                    },
                });

                if (checkCheckinExists) {
                    return await ResponseHelper.Conflict(res, "Check-in email id already exists !", null, "Add Company details!");
                }

                const companyCheckinData = {
                    company_id: addCompany?.id,
                    check_in_email: checkInEmail,
                    check_in_password: hashedcheckInPassword,
                };

                if (!companyCheckinData) {
                    await CompanyCheckInDetails.create(companyCheckinData, { transaction: t });
                }

                const packageDetails = await PackageDetails.findOne({
                    where: {
                        package_id: package_id,
                    },
                });

                if (packageDetails) {
                    const companyPackageData = {
                        company_id: addCompany?.id,
                        package_id: package_id,
                        is_camera_visible: packageDetails?.is_camera_visible,
                        is_id_proof_visible: packageDetails?.is_id_proof_visible,
                        is_wifi_checkbox_visible: packageDetails?.is_wifi_checkbox_visible,
                        is_car_parking_visible: packageDetails?.is_car_parking_visible,
                        is_display_visitor_card_visible: packageDetails?.is_display_visitor_card_visible,
                        is_print_visitor_card_visible: packageDetails?.is_print_visitor_card_visible,
                        is_data_export_available: packageDetails?.is_data_export_available,
                        is_digital_log_visible: packageDetails?.is_digital_log_visible,
                        is_report_export_available: packageDetails?.is_report_export_available,
                    };

                    await CompanyPackageDetails.create(companyPackageData, { transaction: t });
                }

                const appSettingData = {
                    company_id: addCompany.id,
                    is_display_visitor_face_capture_option: 0,
                    is_display_car_parking_option: 0,
                    is_display_wifi_access_option: 0,
                    is_display_id_proof_capture_option: 0,
                    is_display_digital_card: 1,
                    is_display_print_visitor_card: 0,
                };
                const addedAppSettingDetails = await AppSettings.create(appSettingData, { transaction: t });
            });

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Company details added successfully!", addCompany, null, "Add Company details!"));
        } catch (error) {
            // const data = {
            //     error: error.message,
            //     errorStack: error.stack,
            // };
            // await errorLogsCreator.writeLog(data);
            console.log("EROR>>>>>>>>", error);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Add New Company API!"));
        }
    }

    async updateCompanyDetails(req, res) {
        try {
            const { id } = req.params;
            let { name, address, image, code, package_id, duration } = req.body; // Include code in destructuring

            // Sanitize inputs
            name = sanitizeHtml(name);
            address = sanitizeHtml(address);
            image = sanitizeHtml(image);
            code = sanitizeHtml(code); // Sanitize code

            package_id = sanitizeHtml(package_id); // Sanitize code
            duration = sanitizeHtml(duration); // Sanitize code

            // Perform the update operation
            const updatedCompany = await companies.update(
                {
                    name: name,
                    address: address,
                    picture: image,
                    code: code, // Include code in update object
                    status: 1,
                    package_id: package_id,
                    duration: duration,
                },
                {
                    where: {
                        id: id,
                        status: 1,
                    },
                }
            );

            if (updatedCompany[0] === 0) {
                return res.status(404).json({ message: "Company not found or already inactive" });
            }

            if (updatedCompany) {
                const packageDetails = await PackageDetails.findOne({
                    where: {
                        package_id: package_id,
                    },
                });

                if (packageDetails) {
                    const companyPackageData = {
                        company_id: id,
                        package_id: package_id,
                        is_camera_visible: packageDetails?.is_camera_visible,
                        is_id_proof_visible: packageDetails?.is_id_proof_visible,
                        is_wifi_checkbox_visible: packageDetails?.is_wifi_checkbox_visible,
                        is_car_parking_visible: packageDetails?.is_car_parking_visible,
                        is_display_visitor_card_visible: packageDetails?.is_display_visitor_card_visible,
                        is_print_visitor_card_visible: packageDetails?.is_print_visitor_card_visible,
                        is_data_export_available: packageDetails?.is_data_export_available,
                        is_digital_log_visible: packageDetails?.is_digital_log_visible,
                        is_report_export_available: packageDetails?.is_report_export_available,
                    };

                    await CompanyPackageDetails.update(companyPackageData, {
                        where: {
                            company_id: id,
                            package_id: package_id,
                        },
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Company Details Updated Successfully!",
                data: updatedCompany,
            });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }

    async deleteCompanyDetails(req, res) {
        try {
            const id = req.params.id;

            const sanitizedCompanyId = sanitizeHtml(id);

            const deleteCompany = await companies.destroy({
                where: { id: id },
            });

            if (deleteCompany) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Company Deleted Successfully!", deleteCompany, null, "Delete Company!"));
            } else {
                return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound("Company not found.", "Delete Company!"));
            }
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Delete Company API!"));
        }
    }

    async getEmployeesList(req, res) {
        try {
            const { id, role } = req.credentials;
            let { company_id } = req.params;
            const query = req.query;
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;
            company_id = sanitizeHtml(company_id);
            let whereCon = {
                company_id: company_id,
                deleted_at: {
                    [Op.eq]: null,
                },
            };
            let whereConInner = {};
            if (role == Constants.vendorRoleId) {
                whereConInner = {
                    name: { [Op.ne]: "admin" },
                };
            }

            let { rows, count } = await employees.findAndCountAll({
                offset,
                limit,
                where: whereCon,
                order: [["created_at", "DESC"]],
                attributes: ["id", "email", "phone", "department_id", "role_id", [sequelize.literal(`CONCAT(firstname, ' ', middlename, ' ', lastname)`), "fullname"], "picture"],
                include: [
                    {
                        model: Roles,
                        attributes: ["id", ["name", "role"]],
                        required: true,
                    },
                    {
                        model: Departments,
                        where: whereConInner,
                        attributes: ["id", ["display_name", "department"]],
                        required: true,
                    },
                ],
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

            return res.status(errorsHelper.oK).json({
                success: true,
                message: "List of Employees of Selected Company!",
                data: rows,
                action: "Get all employees list",
                meta: meta,
            });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                error: "Error occurred while fetching employee details.",
            });
        }
    }

    async addEmployee(req, res) {
        try {
            // Extract company_id from query parameters
            let { company_id } = req.params;
            let { role, firstname, middlename, lastname, email, phone_prefix, phone, department, picture, password } = req.body;

            role = sanitizeHtml(role);
            firstname = sanitizeHtml(firstname);
            middlename = sanitizeHtml(middlename);
            lastname = sanitizeHtml(lastname);
            email = sanitizeHtml(email);
            phone_prefix = sanitizeHtml(phone_prefix);
            phone = sanitizeHtml(phone);
            department = sanitizeHtml(department);
            picture = sanitizeHtml(picture);
            company_id = sanitizeHtml(company_id); // Sanitize company_id from query

            const newEmployeeData = {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                email: email,
                phone_prefix: phone_prefix,
                phone: phone,
                department_id: department,
                picture: picture,
                role_id: 3,
                company_id: company_id, // Include company_id in the new employee data
            };

            if (role === "admin") {
                password = sanitizeHtml(password);
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
                newEmployeeData.password = hashedPassword;
            }

            let addNewEmployee;
            addNewEmployee = await employees.create(newEmployeeData);

            return res.status(errorsHelper.oK).json({
                success: true,
                message: "New Employee Added!",
                data: addNewEmployee,
                action: "Add New Employee!",
            });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                error: "Error occurred while adding new employee details.",
            });
        }
    }

    async updateEmployeeDetails(req, res) {
        try {
            let { role, firstname, middlename, lastname, email, phone_prefix, phone, department, picture, password } = req.body;

            role = sanitizeHtml(role);
            firstname = sanitizeHtml(firstname);
            middlename = sanitizeHtml(middlename);
            lastname = sanitizeHtml(lastname);
            email = sanitizeHtml(email);
            phone_prefix = sanitizeHtml(phone_prefix);
            phone = sanitizeHtml(phone);
            department = sanitizeHtml(department);
            picture = sanitizeHtml(picture);

            const { company_id, id } = req.params;

            const updateData = {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                email: email,
                phone_prefix: phone_prefix,
                phone: phone,
                department_id: department,
                picture: picture,
                // role_id: role,
            };

            if (role === "admin") {
                password = sanitizeHtml(password);
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }

            const updateEmployee = await employees.update(updateData, {
                where: {
                    id: id,
                    company_id: company_id,
                },
            });

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Employee Details Updated Successfully!", updateEmployee, null, "Employee Company Details"));
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Update Company Details API"));
        }
    }

    async updateAdminDetails(req, res) {
        try {
            let { user_id, company_id, firstname, middlename, lastname, email, phone_prefix, phone, department, picture, password } = req.body;

            firstname = sanitizeHtml(firstname);
            middlename = sanitizeHtml(middlename);
            lastname = sanitizeHtml(lastname);
            email = sanitizeHtml(email);
            phone_prefix = sanitizeHtml(phone_prefix);
            phone = sanitizeHtml(phone);
            department = sanitizeHtml(department);
            picture = sanitizeHtml(picture);
            user_id = sanitizeHtml(user_id);
            company_id = sanitizeHtml(company_id);
            password = sanitizeHtml(password);

            const updateAdmin = await UpdateEmployeeDetails.update(
                {
                    password: password,
                    firstname: firstname,
                    middlename: middlename,
                    lastname: lastname,
                    email: email,
                    phone_prefix: phone_prefix,
                    phone: phone,
                    department_id: department,
                    picture: picture,
                    user_id: 1,
                    company_id: 1,
                },
                {
                    where: {
                        user_id: 1,
                        company_id: 1,
                    },
                }
            );

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Admin Details Updated Successfully!", updateAdmin, null, "Admin Company Details"));
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Update Admin Details API"));
        }
    }

    async deleteEmployee(req, res) {
        try {
            const id = req.params.id;
            const sanitizedEmployeeId = sanitizeHtml(id);
            let deleteCompany;
            deleteCompany = await employees.destroy({
                where: { id: sanitizedEmployeeId },
            });
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Employee Deleted Successfully!", deleteCompany, null, "Delete Employee!"));
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Delete Employee API!"));
        }
    }

    getDepartmentId = async (department) => {
        const departmentMapping = await Departments.findOne({
            attributes: ["id"],
            where: {
                name: data.department.toLowerCase(),
            },
        });
        return departmentMapping.id; // Return null or a default ID if department not found
    };

    async uploadBatchEmployeeData(req, res) {
        try {
            let { path } = req.file;
            const { id } = req.credentials;
            const companyDetails = await employees.findOne({
                attributes: ["company_id"],
                where: {
                    id: id,
                },
            });
            const companyId = companyDetails.company_id;
            let results = [];
            fs.createReadStream(path)
                .pipe(csv())
                .on("data", async (data) => {
                    results.push(data);
                })
                .on("end", async () => {
                    try {
                        for (let i = 0; i < results.length; i++) {
                            results[i].company_id = companyId;
                            const departmentName = results[i].department.toLowerCase();
                            // getting available department
                            const departmentMapping = await Departments.findOne({
                                attributes: ["id"],
                                where: {
                                    name: departmentName,
                                    company_id: companyId,
                                },
                            });
                            // retrun if any department not found in the file, the whole file is rejected
                            if (!departmentMapping) {
                                return await ResponseHelper.BadRequest(res, "The csv file contains invalid departments !", "Import employees csv data API!");
                            }
                            results[i].department_id = departmentMapping.id;
                            results[i].role_id = Constants.UserRoles.employee;
                            results[i].language_id = Constants.Languages.english;
                            const hashedPassword = await bcrypt.hash(results[i].password, 10);
                            results[i].password = hashedPassword;
                        }

                        // Key to remove
                        const keyToRemove = "department";
                        // Remove the key from each object in the array
                        const updatedData = results.map((item) => {
                            const { [keyToRemove]: _, ...rest } = item; // Using destructuring to remove the key
                            return rest;
                        });

                        // Insert data into MySQL table using bulkCreate
                        const importedData = await employees.bulkCreate(updatedData, {
                            ignoreDuplicates: true,
                        });

                        return await ResponseHelper.OK(res, true, "Employees data successfully imported !", null, null, "Import employees csv data API!");
                    } catch (err) {
                        console.error("Error inserting data with bulkCreate:", err);
                    }
                });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return await ResponseHelper.ISError(res, error.message, "Batch Uplaod Data API!");
        }
    }

    async fetchCompanyData(req, res) {
        try {
            const id = req.params.id;
            const sanitizedCompanyId = sanitizeHtml(id);
            const logoURL = process.env.LOGO_URL;

            // Log the logoURL to ensure it is defined correctly

            let fetchData;

            fetchData = await companies.findOne({
                where: { id: sanitizedCompanyId },
                // attributes: ["id", "picture", "code", "name", "address", "status", "updated_at", "created_at"],
            });

            if (fetchData.picture === "null") {
                fetchData.dataValues.picture = null;
            }

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Company Data successfully fetched!", fetchData, null, "Get Company Data API!"));
        } catch (error) {
            console.log("THE ERROR!!!", error);
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);

            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Get Company Data API!"));
        }
    }

    async fetchEmployeeData(req, res) {
        try {
            const id = req.params.id;
            const company_id = req.params.company_id;

            const sanitizedId = sanitizeHtml(id);
            const sanitizedCompanyId = sanitizeHtml(company_id);

            const fetchData = await employees.findOne({
                where: { id: sanitizedId, company_id: sanitizedCompanyId },
                attributes: ["id", "email", "phone", "department_id", "role_id", "firstname", "middlename", "lastname", "phone_prefix"],
                include: [
                    {
                        model: Roles,
                        attributes: ["id", ["name", "role"]],
                        required: true,
                    },
                    {
                        model: Departments,
                        attributes: ["id", ["display_name", "department"]],
                        required: true,
                    },
                ],
            });

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Employee Data successfully fetched!", fetchData, null, "Get Employee Data API!"));
        } catch (error) {
            console.log("THE ERRORRRR!!!", error);
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);

            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Get Employee Data API!"));
        }
    }

    async signIn(req, res) {
        try {
            let { email, password, ip_address, language } = req.body;

            // Sanitize input
            email = sanitizeHtml(email).toLowerCase();
            password = sanitizeHtml(password);
            ip_address = sanitizeHtml(ip_address) || req.socket.remoteAddress;
            language = sanitizeHtml(language);

            // const secret = process.env.JWT_SECRET || "1qazxswedgrt5678909876rgft1wedcfe6^%$&*()wedr@#!!!!%^";
            const superAdminSecret = process.env.JWT_SECRET;

            // Handle superAdmin login
            const existsSuperAdmin = await employees.findOne({
                where: {
                    email: email,
                    role_id: 1,
                },
            });
            if (existsSuperAdmin) {
                const passwordMatch = await bcrypt.compare(password, existsSuperAdmin.password);
                if (!passwordMatch) {
                    return res.status(409).json({ success: false, message: "Invalid Password!" });
                }

                const superAdminRefreshToken = jwt.sign({ _id: existsSuperAdmin.id, roleId: 1 }, superAdminSecret, { expiresIn: "24h" });
                const superAdminToken = jwt.sign({ _id: existsSuperAdmin.id, roleId: 1 }, superAdminSecret, { expiresIn: "20m" });

                const tokenData = {
                    token: superAdminRefreshToken,
                    language: language,
                    role: "superAdmin",
                    updated_at: new Date(),
                };

                const is_refresh_token_super_admin_exists = await userLogin.findOne({
                    where: { account_id: existsSuperAdmin.id },
                });

                if (is_refresh_token_super_admin_exists) {
                    await userLogin.update(tokenData, { where: { account_id: existsSuperAdmin.id } });
                } else {
                    await userLogin.create({
                        account_id: existsSuperAdmin.id,
                        token: superAdminRefreshToken,
                        language: language,
                        ip_address: ip_address,
                        role: "superAdmin",
                        updated_at: new Date(),
                        created_at: new Date(),
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "SuperAdmin login successfully!",
                    access_token: superAdminToken,
                    refresh_token: superAdminRefreshToken,
                    role: "superAdmin",
                    role_id: 1,
                    language_id: existsSuperAdmin.language_id,
                    application_id: 2,
                });
            }
            // Handle admin login
            const existsAdmin = await employees.findOne({
                where: {
                    email: email,
                    role_id: 2,
                },
                include: {
                    model: companies,
                },
            });
            if (!existsAdmin) {
                return res.status(404).json({ success: false, message: "This email id for admin does not exist!" });
            }
            if (existsAdmin.Company.status != 1) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Admin Sign-in API!");
            }

            if (existsAdmin.deleted_at != null) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Admin Sign-in API!");
            }

            const passwordMatch = await bcrypt.compare(password, existsAdmin.password);
            if (!passwordMatch) {
                return res.status(409).json({ success: false, message: "Invalid Password!" });
            }

            const secret = process.env.JWT_SECRET;
            const refreshToken = jwt.sign({ _id: existsAdmin.id, roleId: 2 }, secret, { expiresIn: "24h" });
            const access_token = jwt.sign({ _id: existsAdmin.id, roleId: 2 }, secret, { expiresIn: "20m" });

            const is_refresh_token_user_exists = await userLogin.findOne({
                where: { account_id: existsAdmin.id },
            });

            const tokenData = {
                token: refreshToken,
                language: language,
                role: "admin",
                updated_at: new Date(),
            };

            if (is_refresh_token_user_exists) {
                await userLogin.update(tokenData, { where: { account_id: existsAdmin.id } });
            } else {
                await userLogin.create({
                    account_id: existsAdmin.id,
                    token: refreshToken,
                    language: language,
                    ip_address: ip_address,
                    role: "admin",
                    updated_at: new Date(),
                    created_at: new Date(),
                });
            }

            // Fetch the company name using company_id
            // const company = await companies.findOne({ where: { id: existsAdmin.company_id } });
            const company = await companies.findOne({
                // attributes: ["id", "picture", "code", "name"],
                include: {
                    model: AppSettings,
                    attributes: {
                        exclude: ["deleted_at", "created_at", "updated_at"],
                    },
                },
                where: {
                    id: existsAdmin.company_id,
                },
            });
            if (!company) {
                return res.status(404).json({ success: false, message: "Company not found!" });
            }

            const data = {
                id: existsAdmin.id,
                user_id: existsAdmin.user_id,
                email_id: existsAdmin.email,
                company_id: existsAdmin.company_id, // Include company_id
                company_name: company.name, // Include company_name
                access_token: access_token,
                refresh_token: refreshToken,
                language_id: existsAdmin.language_id,
                application_id: 2,
                role: "admin",
                role_id: 2,
                company_logo: company.picture,
                companyDetails: company,
            };

            // return res.status(200).json({ success: true, message: "Admin login successfully!", data });

            return res.status(200).json({
                success: true,
                message: "Admin login successfully!",
                access_token: access_token,
                refresh_token: refreshToken,
                role: "admin",
                data: data,
            });
        } catch (error) {
            console.error("Sign-in error: ", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async showProfile(req, res) {
        try {
            const { id, role } = req.credentials;

            let fetchData;

            if (role == 1) {
                fetchData = await employees.findOne({
                    attributes: ["id", "company_id", "role_id", "picture", "firstname", "middlename", "lastname", "phone_prefix", "phone", "email", "department_id"],
                    where: {
                        id: id,
                        company_id: 0,
                    },
                    include: {
                        model: companies,
                    },
                });
            } else if (role == 2) {
                fetchData = await employees.findOne({
                    attributes: ["id", "company_id", "role_id", "picture", "firstname", "middlename", "lastname", "phone_prefix", "phone", "email", "department_id"],
                    where: {
                        id: id,
                    },
                    include: {
                        model: companies,
                        attributes: {
                            exclude: ["created_at", "updated_at"],
                        },
                    },
                });
            }

            if (!fetchData) {
                return res.status(errorsHelper.notFound).json(await errorsHelper.NotFound(false, "Profile not found!", "Show Profile API!"));
            }

            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Profile Data successfully fetched!", fetchData, null, "Show Profile Data API!"));
        } catch (error) {
            console.log("Error:", error);
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);

            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Show profile API!"));
        }
    }

    async updateProfile(req, res) {
        try {
            let { firstname, middlename, lastname, email, phone_prefix, phone, password, image } = req.body;

            // Sanitize input
            firstname = sanitizeHtml(firstname);
            middlename = sanitizeHtml(middlename);
            lastname = sanitizeHtml(lastname);
            email = sanitizeHtml(email);
            phone = sanitizeHtml(phone);
            phone_prefix = sanitizeHtml(phone_prefix);
            image = sanitizeHtml(image);

            const { id, role, companyId } = req.credentials; // Ensure credentials are properly extracted
            if (!id || !role) {
                return res.status(400).json({ success: false, message: "Missing required credentials" });
            }

            let updateData = {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                email: email,
                phone_prefix: phone_prefix,
                phone: phone,
                picture: image,
            };

            if (password) {
                password = sanitizeHtml(password);
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }

            let comapniesUpdatedData = {
                picture: image,
                name: firstname,
            };

            let fetchData;

            if (role == 1) {
                fetchData = await employees.update(updateData, { where: { id: id } });
            } else {
                fetchData = await employees.update(updateData, { where: { id: id, company_id: companyId } });
                await Companies.update(comapniesUpdatedData, { where: { id: companyId } });
            }

            return res.status(200).json({
                success: true,
                message: "Profile Data successfully Updated!",
                data: fetchData,
            });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);

            return res.status(500).json({
                success: false,
                message: "Update profile API!",
                error: error.message,
            });
        }
    }

    async passwordChange(req, res) {
        const { id, role } = req.credentials;
        try {
            let { password, is_first_password_changed } = req.body;
            password = sanitizeHtml(password);
            is_first_password_changed = sanitizeHtml(is_first_password_changed);

            if (role != 1 && role != 2) {
                return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("You are not authorized to change the password!", "Change password API!"));
            }

            const userDetails = await employees.findOne({ where: { id: id } });
            if (!userDetails) {
                return res.status(errorsHelper.unAuthorized).json(await errorsHelper.UnAuthorized("Invalid user details!", "Change password API!"));
            }

            if (is_first_password_changed) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const updatePassword = await employees.update(
                    {
                        password: hashedPassword,
                        is_first_password_changed: 1,
                    },
                    {
                        where: { id: id },
                    }
                );
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Your password has been updated!", updatePassword, null, "Change password API!"));
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const updatePassword = await employees.update(
                {
                    password: passwordHash,
                },
                {
                    where: { id: id },
                }
            );
            return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Your password has been updated!", updatePassword, null, "Change password API!"));
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
                inputs: req.body,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json(await errorsHelper.ISError(error.message, "Change password API!"));
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await employees.findOne({
                where: {
                    email: email,
                    id: {
                        [Op.ne]: 0,
                    },
                },
            });

            if (!user) {
                return res.status(403).json({
                    error: {
                        message: "Invalid email",
                    },
                });
            }
            const currentDate = new Date(); // Current date and time
            const sent_at = currentDate.toISOString(); // Date with 5 minutes added in ISO format
            const expired_at = currentDate.setMinutes(currentDate.getMinutes() + 2); // Add 5 minutes

            const otp = await commonHelper.genrateOTP();

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

            let supportEmail = process.env.SUPPORT_EMAIL;
            let html_body = `<html><head><title>Reset Your Password</title></head><body><p>Dear ${user.name},</p><p>We received a request to reset the password for your account. To reset your password, please enter the otp ${otp}</p><p>If you did not request a password reset, please ignore this email.</p><p>Please note that this otp is valid for 2 minutes only. If you do not reset your password within this time frame, you will need to request another password reset.</p><p>If you have any questions or concerns, please contact our support team at ${supportEmail}.</p><p>Thank you,</p><p>Cuppanord</p></body></html>`;
            let body = {
                email: email,
                subject: "Reset Password",
                html_body: html_body,
            };
            const reset_email = await commonHelper.sendEmail(body);

            return res.status(200).json({
                message: "OTP has been sent to your Email successfully",
            });
        } catch (error) {
            console.error("ERRRO IS!", error);
            return res.status(500).json({
                error: {
                    message: "Failed to Reset Password",
                },
            });
        }
    }

    async logout(req, res) {
        try {
            const { id } = req.credentials;

            const tokenData = await userLogin.findOne({
                where: { account_id: id },
            });

            if (!tokenData) {
                return res.status(errorsHelper.notFound).json({
                    success: false,
                    message: "Token data not found. User may not be logged in.",
                });
            }

            const deletedTokenData = await userLogin.destroy({
                where: { account_id: id },
            });

            if (deletedTokenData) {
                return res.status(errorsHelper.oK).json({
                    success: true,
                    message: "Logout successful!",
                });
            } else {
                return res.status(errorsHelper.notFound).json({
                    success: false,
                    message: "Failed to delete token data. Logout unsuccessful.",
                });
            }
        } catch (error) {
            console.error("Error during logout:", error);
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                success: false,
                message: "An error occurred during logout. Please try again later.",
            });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            // Verify the refresh token
            const secret = process.env.JWT_SECRET;
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, secret);
            } catch (error) {
                return await ResponseHelper.ISError(res, error.message, "Refresh Token API.");
            }

            const existsUser = await employees.findOne({ where: { id: decoded._id } });
            if (!existsUser) {
                return res.status(404).json({ success: false, message: "User not found!" });
            }
            // Generate new tokens
            const newAccessToken = jwt.sign({ _id: existsUser.id, roleId: existsUser.role_id }, secret, { expiresIn: "20m" });
            const newRefreshToken = jwt.sign({ _id: existsUser.id, roleId: existsUser.role_id }, secret, { expiresIn: "24h" });

            // Update the refresh token in the database
            const tokenData = {
                token: newRefreshToken,
                updated_at: new Date(),
            };
            await userLogin.update(tokenData, { where: { account_id: existsUser.id } });
            return res.status(200).json({
                success: true,
                message: "Refresh token updated successfully!",
                data: {
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                },
            });
        } catch (error) {
            console.error("Refresh token error: ", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            // Find the user by ID and update their profile
            const user = await employees.findOne({ where: { email: email } });

            if (!user) {
                return res.status(403).json({
                    error: {
                        message: "Invalid email",
                    },
                });
            }

            const userPasswordRecoveryData = await PasswordRecovery.findOne({
                where: { user_id: user.id },
            });

            if (!userPasswordRecoveryData) {
                return res.status(401).json({
                    error: {
                        message: "Invalid user",
                    },
                });
            }

            if (userPasswordRecoveryData.otp != otp) {
                return res.status(401).json({
                    error: {
                        message: "Invalid OTP",
                    },
                });
            }

            const currentDate = new Date(); // Current date and time
            const expire_time = currentDate.toISOString(); // Date with 5 minutes added in ISO format

            const expiredAtDate = new Date(userPasswordRecoveryData.expired_at).toISOString();

            if (expiredAtDate < expire_time) {
                return res.status(401).json({
                    error: {
                        message: "OTP Expired",
                    },
                });
            }

            return res.status(200).json({
                message: "OTP verified successfully",
            });
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: "Failed to Verify OTP",
                },
            });
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, otp, password } = req.body;
            // Find the user by ID and update their profile
            const user = await employees.findOne({ where: { email: email } });

            if (!user) {
                return res.status(401).json({
                    error: {
                        message: "Invalid email",
                    },
                });
            }

            const userPasswordRecoveryData = await PasswordRecovery.findOne({
                where: { user_id: user.id },
            });

            if (!userPasswordRecoveryData) {
                return res.status(401).json({
                    error: {
                        message: "Invalid user",
                    },
                });
            }

            if (userPasswordRecoveryData.otp != otp) {
                return res.status(401).json({
                    error: {
                        message: "Invalid OTP",
                    },
                });
            }

            const currentDate = new Date(); // Current date and time
            const expire_time = currentDate.toISOString(); // Date with 5 minutes added in ISO format

            const expiredAtDate = new Date(userPasswordRecoveryData.expired_at).toISOString();

            if (expiredAtDate < expire_time) {
                return res.status(401).json({
                    error: {
                        message: "OTP Expired",
                    },
                });
            }

            if (userPasswordRecoveryData.is_used == 1) {
                return res.status(401).json({
                    error: {
                        message: "OTP already Used",
                    },
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await user.update({ password: hashedPassword });
            await userPasswordRecoveryData.update({ is_used: 1 });
            return res.status(200).json({
                message: "Password reset successful",
            });
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: "Failed to Verify OTP",
                },
            });
        }
    }

    //#region departments functions
    async addDepartment(req, res) {
        try {
            let { name, color } = req.body;
            const { id, role } = req.credentials;
            const { companyId } = req.credentials;
            let displayName = sanitizeHtml(name);
            color = sanitizeHtml(color);

            const depName = displayName.toLowerCase();
            const isExists = await Departments.findOne({
                attributes: ["id", "name", "display_name", "created_at"],
                where: {
                    name: depName,
                    company_id: companyId,
                },
            });
            if (isExists) {
                return await ResponseHelper.Conflict(res, "This department name already exists !", isExists, "Add department API!");
            }
            const data = {
                name: depName,
                display_name: name,
                color: color,
                company_id: companyId,
            };
            const insertedData = await Departments.create(data);
            if (insertedData) {
                return await ResponseHelper.OK(res, true, "Department name added successfully !", null, null, "Add department API!");
            }
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Add department API!");
        }
    }

    async updateDepartment(req, res) {
        try {
            let { id, name, color } = req.body;
            const { companyId } = req.credentials;

            let displayName = sanitizeHtml(name);
            color = sanitizeHtml(color);
            const depName = displayName.toLowerCase();
            const isExists = await Departments.findOne({
                where: {
                    id: id,
                    company_id: companyId,
                },
            });
            if (!isExists) {
                return await ResponseHelper.NotFound(res, false, "Invalid department id !", "Update department API!");
            }
            const data = {
                name: depName,
                display_name: name,
                color: color,
                company_id: companyId,
            };
            const isNameAndIdExists = await Departments.findOne({
                attributes: ["id", "name", "display_name", "created_at"],
                where: {
                    id: { [Op.ne]: id },
                    name: depName,
                    company_id: companyId,
                },
            });
            if (isNameAndIdExists) {
                return await ResponseHelper.Conflict(res, "This department name already exists !", isNameAndIdExists, "Update department API!");
            }
            const updatedData = await Departments.update(data, { where: { id: id } });
            if (updatedData) {
                return await ResponseHelper.OK(res, true, "Department details updated successfully !", null, null, "Update department API!");
            }
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Update department API!");
        }
    }

    async getDepartmentsList(req, res) {
        try {
            const { companyId } = req.credentials;
            const { id, role } = req.credentials;

            console.log(">>>>>", req.credentials);
            const query = req.query;
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;
            const { rows, count } = await Departments.findAndCountAll({
                offset,
                limit,
                attributes: ["id", "name", "display_name", "color", "deleted_at", "created_at"],
                where: {
                    company_id: companyId,
                },
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
            const updatedRows = rows.map((item) => ({
                ...item.dataValues,
                is_blocked: item.deleted_at !== null,
            }));
            return await ResponseHelper.OK(res, true, "Departments list fetched successfully !", updatedRows, meta, "Fetch departments list API!");
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Fetch departments list API!");
        }
    }

    async getDepartmentsDropDown(req, res) {
        try {
            const { companyId } = req.credentials;
            const query = req.query;
            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = (page - 1) * limit;
            const { rows, count } = await Departments.findAndCountAll({
                offset,
                limit,
                attributes: ["id", "name", "display_name", "color", "deleted_at", "created_at"],
                where: {
                    company_id: companyId,
                    deleted_at: {
                        [Op.eq]: null,
                    },
                },
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
            const updatedRows = rows.map((item) => ({
                ...item.dataValues,
                is_blocked: item.deleted_at !== null,
            }));
            return await ResponseHelper.OK(res, true, "Departments list fetched successfully !", updatedRows, meta, "Fetch departments list API!");
        } catch (error) {
            console.log("ERORRRRRRRRRRRR", error);
            return await ResponseHelper.ISError(res, error.message, "Fetch departments list API!");
        }
    }

    async getDepartmentDetails(req, res) {
        try {
            const { id } = req.params;
            const departmentsDetails = await Departments.findAll({
                attributes: ["id", "display_name", "color", "created_at"],
                where: { id: id },
            });
            if (!departmentsDetails) {
                return await ResponseHelper.NotFound(res, false, "Invalid department id !", "Fetch department details API!");
            }
            return await ResponseHelper.OK(res, true, "Department details fetched successfully !", departmentsDetails, null, "Fetch department details API!");
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Fetch department details API!");
        }
    }

    async enableDisableDepartment(req, res) {
        try {
            let { id, isDisabled } = req.body;
            let msg = "";
            const isExists = await Departments.findOne({
                where: {
                    id: id,
                },
            });
            if (!isExists) {
                return await ResponseHelper.NotFound(res, false, "Invalid department id !", "Enable/Disable department API!");
            }
            let data = {};
            if (isDisabled == 0) {
                msg = "enabled";
                data = { deleted_at: null };
            } else {
                msg = "disabled ";
                data = { deleted_at: new Date() };
            }

            const updatedData = await Departments.update(data, { where: { id: id } });
            if (updatedData) {
                return await ResponseHelper.OK(res, true, `Department ${msg} successfully !`, null, null, "Enable/Disable department API!");
            }
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Enable/Disable department API!");
        }
    }

    //#endregion

    //#region
    async activateDeactivateCompany(req, res) {
        try {
            let { id, isActive } = req.body;
            let msg = "";
            const isExists = await companies.findOne({
                where: {
                    id: id,
                },
            });
            if (!isExists) {
                return await ResponseHelper.NotFound(res, false, "Invalid company id !", "Activate/deactivate company API!");
            }
            const data = {
                status: isActive,
            };
            if (isActive == 0) {
                msg = "de-activated";
            } else {
                msg = "activated ";
            }

            const updatedData = await companies.update(data, { where: { id: id } });
            if (updatedData) {
                return await ResponseHelper.OK(res, true, `Comapny ${msg} successfully !`, null, null, "Activate/deactivate company API!");
            }
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Activate/deactivate company API!");
        }
    }
    //#endregion

    //#region App Settings

    async appSettings(req, res) {
        try {
            const { company_id } = req.params;

            const settingsData = await AppSettings.findOne({
                where: {
                    company_id,
                    deleted_at: null,
                },
                attributes: [
                    "is_display_visitor_face_capture_option",
                    "is_display_car_parking_option",
                    "is_display_wifi_access_option",
                    "is_display_id_proof_capture_option",
                    "is_display_digital_card",
                    "is_display_print_visitor_card",
                    "wifi_name",
                    "wifi_password",
                ],
            });

            return await ResponseHelper.OK(res, true, `App settings fetched successfully !`, settingsData, null, "App settings API!");
        } catch (error) {
            console.log("ERRRORR!!", error);
            return await ResponseHelper.ISError(res, error.message, "App Settings API!");
        }
    }

    async updateAppSettings(req, res) {
        try {
            let { wifiName, wifiPassword, companyId, isDisplayVisitorFace, isDisplayCarParkingCheckbox, isDisplayWifiCheckbox, isDisplayIdProof, isDisplayDigitalCard, isDisplayPrintVisitorCard } =
                req.body;
            let msg = "";
            wifiName = sanitizeHtml(wifiName);
            wifiPassword = sanitizeHtml(wifiPassword);
            const isExists = await AppSettings.findOne({
                where: {
                    company_id: companyId,
                },
            });
            if (!isExists) {
                return await ResponseHelper.NotFound(res, false, "Invalid company id !", "Update app settings API!");
            }
            const data = {
                is_display_visitor_face_capture_option: isDisplayVisitorFace,
                is_display_car_parking_option: isDisplayCarParkingCheckbox,
                is_display_wifi_access_option: isDisplayWifiCheckbox,
                is_display_id_proof_capture_option: isDisplayIdProof,
                is_display_digital_card: isDisplayDigitalCard,
                is_display_print_visitor_card: isDisplayPrintVisitorCard,
                wifi_name: wifiName,
                wifi_password: wifiPassword,
            };

            const updatedData = await AppSettings.update(data, { where: { company_id: companyId } });
            if (updatedData) {
                return await ResponseHelper.OK(res, true, `App settings updated successfully !`, null, null, "Update app settings API!");
            }
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Update app settings API!");
        }
    }
    //#endregion
}

module.exports = new AdminController();
