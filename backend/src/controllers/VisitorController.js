const jwt = require("jsonwebtoken");
const userLogin = require("../models/userLoginModel");
const commonHelper = require("../helpers/CommonHelper");
const sequelize = require("../config/db.config").sequelize;
const { Op } = require("sequelize");
const sanitizeHtml = require("sanitize-html");
const errorsHelper = require("../helpers/ErrorHelper");
const errorLogsCreator = require("../helpers/ErrorLogsCreator");
const companies = require("../models/companiesModel");
const employees = require("../models/employeeModel");
const Visitors = require("../models/visiitorModel");
const ResponseHelper = require("../helpers/ResponseHelper");
const bcrypt = require("bcrypt");
const { appSettingsSchema } = require("../JoiValidations/adminJoiSchema");
const AppSettings = require("../models/appSettingsModel");
const Departments = require("../models/departmentsModel");
const { response } = require("express");
const CompanyPackageDetails = require("../models/companyPackageDetailsModel");
const CompanyCheckInDetails = require("../models/companyCheckInMapModel");
const Companies = require("../models/companiesModel");
const CompanySignUpDetails = require("../models/company_sign_up_details");
require("dotenv").config();

class VisitorController {
    async saveVisitorDetails(req, res) {
        try {
            let {
                image,
                employee_company_id,
                employee_id,
                name,
                phone_prefix,
                phone_number,
                email,
                reason,
                company,
                status,
                vehicle_registration_number,
                is_visitor_details_saved,
                is_wifi_access_provided,
                is_car_parked,
            } = req.body;

            image = sanitizeHtml(image);
            name = sanitizeHtml(name);
            phone_prefix = sanitizeHtml(phone_prefix);
            phone_number = sanitizeHtml(phone_number);
            email = sanitizeHtml(email);
            reason = sanitizeHtml(reason);
            company = sanitizeHtml(company);
            status = sanitizeHtml(status);
            vehicle_registration_number = sanitizeHtml(vehicle_registration_number);
            is_visitor_details_saved = parseInt(sanitizeHtml(is_visitor_details_saved));
            is_wifi_access_provided = parseInt(sanitizeHtml(is_wifi_access_provided));
            is_car_parked = parseInt(sanitizeHtml(is_car_parked));

            const visitorData = {
                image: image,
                company_id: employee_company_id,
                employee_id: employee_id,
                name: name,
                phone_prefix: phone_prefix,
                phone_number: phone_number,
                email: email,
                reason: reason,
                company: company,
                status: 1,
                vehicle_registration_number: vehicle_registration_number,
                is_visitor_details_saved: is_visitor_details_saved,
                is_wifi_access_provided: is_wifi_access_provided,
                is_car_parked: is_car_parked,
            };

            const saveVisitorInfo = await Visitors.create(visitorData);

            return res.status(errorsHelper.oK).json({
                success: true,
                message: "Visitor details successfully saved",
                data: saveVisitorInfo,
                action: "store visitor detail",
            });
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            console.error("Error saving visitor details: ", data);
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                error: "Error occurred while saving visitor details.",
                message: error.message,
            });
        }
    }

    async showCompanyList(req, res) {
        try {
            let { id, code, name, address, picture, status } = req.body;
            id = sanitizeHtml(id);
            code = sanitizeHtml(code);
            name = sanitizeHtml(name);
            address = sanitizeHtml(address);
            picture = sanitizeHtml(picture);
            status = sanitizeHtml(status);

            if (picture === "null") {
                picture = null;
            }

            let activeCompanies;

            activeCompanies = await companies.findAll({
                order: [["created_at", "DESC"]],
                where: {
                    status: 1,
                },
                attributes: ["id", "name", "picture"],
            });

            activeCompanies = activeCompanies.map((company) => {
                if (company.picture === "null") {
                    company.picture = null;
                }
                return company;
            });

            if (activeCompanies) {
                return res.status(errorsHelper.oK).json(await errorsHelper.OK(true, "Active Companies List!", activeCompanies, null, "Get all active companies"));
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

    async showEmployeeList(req, res) {
        try {
            let { departmentId } = req.params;
            const { companyId } = req.credentials;

            departmentId = sanitizeHtml(departmentId);
            const employeesList = await employees.findAll({
                order: [["created_at", "DESC"]],
                where: {
                    company_id: companyId,
                    department_id: departmentId,
                },
                attributes: ["id", "company_id", "role_id", "picture", [sequelize.literal(`CONCAT(firstname, ' ', middlename, ' ', lastname)`), "fullname"]],
            });
            return res.status(errorsHelper.oK).json({
                success: true,
                message: "Employees of the selected company with active status!",
                data: employeesList,
                action: "Get all employees list",
            });
        } catch (error) {
            console.log("ERROR IS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1", error);
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

    async uploadImage(req, res) {
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
            const baseURL = process.env.BASE_URL;
            const data = {
                fileName: fName,
                file: req.file,
            };
            // const uploadDetails = await commonHelper.upload_aws(data);
            const url = `${baseURL}/${filename}`;
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

    async fetchVisitorDetails(req, res) {
        try {
            const { id } = req.params; // Extract id from request parameters

            // Sanitize the id if necessary
            const sanitizedId = sanitizeHtml(id);

            // Fetch specific fields along with visitor details from the database using the id
            const visitorDetails = await Visitors.findByPk(sanitizedId, {
                attributes: ["company_id", "name", "phone_prefix", "phone_number", "email", "reason", "company", "vehicle_registration_number"],
            });

            if (!visitorDetails) {
                return res.status(errorsHelper.notFound).json({
                    success: false,
                    message: "Visitor details not found!",
                    errorCode: null,
                    context: "Fetch visitor details",
                });
            }

            // Send success response with visitor details
            return res.status(errorsHelper.oK).json({
                success: true,
                message: "Visitor details successfully fetched!",
                data: visitorDetails,
                errorCode: null,
                context: "Fetch visitor details",
            });
        } catch (error) {
            // Handle errors if any
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            await errorLogsCreator.writeLog(data);
            return res.status(errorsHelper.iSError).json({
                success: false,
                error: error.message,
                context: "Fetch Visitor Details API!",
            });
        }
    }

    async checkIn(req, res) {
        try {
            let { email, password, ip_address } = req.body;
            ip_address = sanitizeHtml(ip_address) || req.socket.remoteAddress;
            email = sanitizeHtml(email);
            password = sanitizeHtml(password);
            const existsAdmin = await employees.findOne({
                where: {
                    email: email,
                    role_id: 3,
                },
                include: {
                    model: companies,
                },
            });
            if (!existsAdmin) {
                return res.status(404).json({ success: false, message: "This email id for admin does not exist!" });
            }

            if (existsAdmin.Company.status != 1) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Check in module Sign-in API!");
            }
            if (existsAdmin.deleted_at != null) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Check in module Sign-in API!");
            }

            const passwordMatch = await bcrypt.compare(password, existsAdmin.password);
            if (!passwordMatch) {
                return await ResponseHelper.Conflict(res, "Invalid password !", null, "Check in module Sign-in API!");
            }

            const secret = process.env.JWT_SECRET;
            const refreshToken = jwt.sign({ _id: existsAdmin.id, roleId: 3 }, secret, { expiresIn: "7d" });
            const access_token = jwt.sign({ _id: existsAdmin.id, roleId: 3 }, secret, { expiresIn: "24h" });

            const is_refresh_token_user_exists = await userLogin.findOne({
                where: { account_id: existsAdmin.id },
            });

            const tokenData = {
                token: refreshToken,
                language: "en",
                role: "employee",
                updated_at: new Date(),
            };

            if (is_refresh_token_user_exists) {
                await userLogin.update(tokenData, { where: { account_id: existsAdmin.id } });
            } else {
                await userLogin.create({
                    account_id: existsAdmin.id,
                    token: refreshToken,
                    language: "en",
                    ip_address: ip_address,
                    role: "employee",
                    updated_at: new Date(),
                    created_at: new Date(),
                });
            }

            // Fetch the company name using company_id
            // const company = await companies.findOne({
            //     attributes: ["id", "picture", "code", "name", "uuid"],
            //     include: {
            //         model: AppSettings,
            //         attributes: {
            //             exclude: ["deleted_at", "created_at", "updated_at"],
            //         },
            //     },
            //     where: {
            //         id: existsAdmin.company_id,
            //     },
            // });

            const checkInData = await CompanyCheckInDetails.findOne({
                where: {
                    check_in_email: email,
                },
            });

            const company = await CompanyPackageDetails.findOne({
                where: {
                    company_id: checkInData?.company_id,
                },
            });

            const companyData = await Companies.findOne({
                where: {
                    id: checkInData?.company_id,
                },
            });
            const companySignUpDetails = await CompanySignUpDetails.findOne({
                where: {
                    id: companyData?.companies_sign_up_details_id,
                },
            });

            if (!company) {
                return await ResponseHelper.NotFound(res, false, "This email is not registered with any company !", "Check in module Sign-in API!");
            }

            const data = {
                id: existsAdmin.id,
                user_id: existsAdmin.user_id,
                email_id: existsAdmin.email,
                access_token: access_token,
                refresh_token: refreshToken,
                language_id: existsAdmin.language_id,
                application_id: 1,
                role: existsAdmin.role,
                companyDetails: company,
                role_id: existsAdmin.role_id,
                company_check_in_details: checkInData,
                picture: companyData?.picture,
                name: companyData?.name,
                company_email: companySignUpDetails?.company_admin_email,
            };

            return await ResponseHelper.OK(res, true, "Your check-in process successfully completed", data, null, "Check in module Sign-in API");
        } catch (error) {
            console.log("ERRRRRRRRRRRRRRR", error);
            return await ResponseHelper.ISError(res, error.message, "Check in module Sign-in API!");
        }
    }

    uploadIdProofsImages = async (req, res) => {
        try {
            const filesData = req.files;
            const imageBaseUrl = process.env.FILES_BASE_URL;
            let filesArray = [];
            filesData.forEach((file) => {
                let obj = {
                    imageName: file.filename,
                    url: `${imageBaseUrl}/visitor_id_proofs_images/${file.filename}`,
                };
                filesArray.push(obj);
            });

            return await ResponseHelper.OK(res, true, "Id proof document uploaded successfully!", filesArray, null, "Upload id proofs images API!");
        } catch (error) {
            const data = {
                error: error.message,
                errorStack: error.stack,
            };
            ////  await errorLogsCreator.writeLog(data);
            return await ResponseHelper.ISError(res, error.message, "Upload id proofs images API!");
        }
    };

    getVisitorDetails = async (req, res) => {
        try {
            let { mobile } = req.params;
            mobile = sanitizeHtml(mobile);
            const searchDetails = await Visitors.findOne({
                attributes: {
                    exclude: ["created_at", "updated_at", "status"],
                },
                where: {
                    phone_number: mobile,
                },
                order: [["created_at", "DESC"]],
            });
            if (!searchDetails) {
                return await ResponseHelper.NotFound(res, false, "Data not found !", "Find existing details of visitor API.");
            }
            return await ResponseHelper.OK(res, true, "Visitor details fetched successfully !", searchDetails, null, "Find existing details of visitor API.");
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Find existing details of visitor API.");
        }
    };

    /// To by pass visitor from login screen when scan QR code using mobile
    async mobileCheckIn(req, res) {
        try {
            let { email, companyId, mobile } = req.body;
            email = sanitizeHtml(email);
            companyId = sanitizeHtml(companyId);
            mobile = sanitizeHtml(mobile);
            if (mobile != 1) {
                return await ResponseHelper.BadRequest(res, "Invalid request !", "Check in module Sign-in API!");
            }
            const existsAdmin = await employees.findOne({
                where: {
                    email: email,
                    role_id: 3,
                },
                include: {
                    model: companies,
                    where: {
                        uuid: companyId,
                    },
                    required: true,
                },
            });
            if (!existsAdmin) {
                return await ResponseHelper.NotFound(res, false, "Invalid email or company Id !", "Mobile check in module Sign-in API!");
            }

            if (existsAdmin.Company.status != 1) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Mobile check in module Sign-in API!");
            }
            if (existsAdmin.deleted_at != null) {
                return await ResponseHelper.Gone(res, "This email blocked by Super admin, Please conatact your service provider!", "Mobile check in module Sign-in API!");
            }
            const secret = process.env.JWT_SECRET;
            const access_token = jwt.sign({ _id: existsAdmin.id, roleId: 3 }, secret, { expiresIn: "5min" });

            /// Fetch the company name using company_id
            const company = await companies.findOne({
                attributes: ["id", "picture", "code", "name", "uuid"],
                include: {
                    model: AppSettings,
                    attributes: {
                        exclude: ["deleted_at", "created_at", "updated_at"],
                    },
                },
                where: {
                    uuid: companyId,
                },
                required: true,
            });
            if (!company) {
                return await ResponseHelper.NotFound(res, false, "This email is not registered with any company !", "Mobile check in module Sign-in API!");
            }

            const data = {
                id: existsAdmin.id,
                user_id: existsAdmin.user_id,
                email_id: existsAdmin.email,
                access_token: access_token,
                language_id: existsAdmin.language_id,
                application_id: 1,
                role: existsAdmin.role,
                companyDetails: company,
                role_id: existsAdmin.role_id,
            };
            return await ResponseHelper.OK(res, true, "Your mobile check-in process successfully completed", data, null, "Mobile check in module Sign-in API");
        } catch (error) {
            return await ResponseHelper.ISError(res, error.message, "Mobile check in module Sign-in API!");
        }
    }
}
module.exports = new VisitorController();
