const adminRoute = require("express").Router();
const adminController = require("../controllers/adminController");
const validationMiddleware = require("../middlewares/validateRequest");
const addCompanySchema = require("../JoiValidations/addCompanyJoiSchema");
const updateCompanyDetailsSchema = require("../JoiValidations/updateCompanyDetailsJoiSchema");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/imageUploader");
const addNewEmployeeSchema = require("../JoiValidations/addEmployeeJoiSchema");
const addAdminSchema = require("../JoiValidations/addAdminJoiSchema");
const updateEmployeeDetailsSchema = require("../JoiValidations/updateEmployeeDetailsJoiSchema");
const updateAdminSchema = require("../JoiValidations/updateAdminJoiSchema");
const adminAuthSchema = require("../JoiValidations/adminLoginJoiSchema");
const changePasswordSchema = require("../JoiValidations/changePasswordJoiSchema");
const updateProfileSchema = require("../JoiValidations/updateProfileJoiSchema");
const forgetPasswordSchema = require("../JoiValidations/forgetPasswordJoiSchema");
const signInSchema = require("../JoiValidations/signInJoiSchema");
const adminSchema = require("../JoiValidations/adminJoiSchema");
const permissions = require("../middlewares/Permissions");

//#region auth
adminRoute.post("/signin", validationMiddleware.validate(signInSchema.signInSchema.login, "body"), adminController.signIn);
adminRoute.get("/show-profile", auth.authenticate(), permissions.checkAdminAndSuperAdminPermission(), adminController.showProfile);
adminRoute.put(
    "/update-profile",
    auth.authenticate(),
    permissions.checkAdminAndSuperAdminPermission(),
    upload.uploadImage.single("image"),
    validationMiddleware.validate(updateProfileSchema.updateProfileSchema.updateProfileDetails, "body"),
    adminController.updateProfile
);
adminRoute.put(
    "/changepassword",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(changePasswordSchema.changePasswordSchema.changePassword, "body"),
    adminController.passwordChange
);
adminRoute.put(
    "/forgetpassword",
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(forgetPasswordSchema.forgetPasswordSchema.forgetPassword, "body"),
    adminController.forgotPassword
);
adminRoute.get("/signout", auth.authenticate(), adminController.logout);
adminRoute.put(
    "/update-admin-details",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(updateAdminSchema.updateAdminSchema.updateAdmin, "body"),
    adminController.updateAdminDetails
);
adminRoute.post("/refreshtoken", validationMiddleware.validate(adminSchema.authSchema.refreshToken, "body"), adminController.refreshToken);
adminRoute.post("/verify-otp", adminController.verifyOtp);
adminRoute.put("/reset-password", adminController.resetPassword);
//#endregion

//#region company routes
adminRoute.post(
    "/add-Company",
    auth.authenticate(),
    permissions.checkAdminAndSuperAdminPermission(),
    upload.uploadImage.single("image"),
    validationMiddleware.validate(addCompanySchema.addCompanySchema.addNewCompanyDetails, "body"),
    adminController.addNewCompanies
);
adminRoute.put(
    "/update-company-details/:id",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    upload.uploadImage.single("image"),
    validationMiddleware.validate(updateCompanyDetailsSchema.updateCompanyDetails.updateNewCompanyDetails, "body"),
    adminController.updateCompanyDetails
);
adminRoute.get("/get-companies-list", auth.authenticate(), permissions.checkAdminAndSuperAdminPermission(), adminController.getCompaniesList);
adminRoute.delete("/delete-company/:id", auth.authenticate(), adminController.deleteCompanyDetails);
adminRoute.put(
    "/active-deactive-company",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(adminSchema.companySchema.activateDeactivateCompany, "body"),
    adminController.activateDeactivateCompany
);
adminRoute.post("/upload-company-logo", upload.uploadImage.single("image"), adminController.uploadCompanyLogo);
//#endregion

//#region visitors
adminRoute.get("/get-visitors-list/:companyId", auth.authenticate(), permissions.checkAdminAndSuperAdminPermission(), adminController.getVisitorList);
adminRoute.get("/get-employees-list/:company_id", auth.authenticate(), permissions.checkAdminAndSuperAdminPermission(), adminController.getEmployeesList);
//#endregion

//#region employees
adminRoute.post("/add-new-employee", auth.authenticate(), adminController.addEmployee);
adminRoute.post(
    "/add-new-employee/:company_id",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(addNewEmployeeSchema.addEmployeeSchema.addNewEmployee, "body"),
    adminController.addEmployee
);
adminRoute.put(
    "/update-employee-details/:company_id/:id",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(updateEmployeeDetailsSchema.updateEmployeeDetails.updateNewEmployeeDetails, "body"),
    adminController.updateEmployeeDetails
);
adminRoute.post("/upload-batch-employee-data", auth.authenticate(), upload.uploadFile.single("file"), adminController.uploadBatchEmployeeData);
adminRoute.delete("/delete-employee/:id", auth.authenticate(), adminController.deleteEmployee);
adminRoute.get("/fetch-company-data/:id", auth.authenticate(), adminController.fetchCompanyData);
adminRoute.get("/fetch-employee-data/:company_id/:id", auth.authenticate(), adminController.fetchEmployeeData);
//#endregion

//#region departments
adminRoute.post(
    "/add-department",
    auth.authenticate(),
    permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(adminSchema.departmentSchema.addDepartment, "body"),
    adminController.addDepartment
);
adminRoute.put(
    "/edit-department",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(adminSchema.departmentSchema.updateDepartment, "body"),
    adminController.updateDepartment
);
adminRoute.get("/departments-list", auth.authenticate(), adminController.getDepartmentsList);
adminRoute.get("/departments-dropdown", auth.authenticate(), adminController.getDepartmentsDropDown);
adminRoute.get("/department-details/:id", auth.authenticate(), adminController.getDepartmentDetails);
adminRoute.put(
    "/enable-disable-department",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(adminSchema.departmentSchema.enableDisableDepartment, "body"),
    adminController.enableDisableDepartment
);
//#endregion

//#region app settings
adminRoute.get("/app-settings/:company_id", auth.authenticate(), permissions.checkAdminAndSuperAdminPermission(), adminController.appSettings);
adminRoute.put(
    "/edit-app-settings",
    auth.authenticate(),
    // permissions.checkAdminAndSuperAdminPermission(),
    validationMiddleware.validate(adminSchema.appSettingsSchema.edit, "body"),
    adminController.updateAppSettings
);
//#endregion

module.exports = adminRoute;
