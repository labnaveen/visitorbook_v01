const packageRoute = require("express").Router();
const packageController = require("../controllers/packageController");
const packageValidation = require("../JoiValidations/packageSchema");
const validationMiddleware = require("../middlewares/validateRequest");
const auth = require("../middlewares/auth");
const { uploadFiles } = require("../middlewares/imagesUploader");

packageRoute.post("/add-package", auth.authenticate(), validationMiddleware.validate(packageValidation.packageSchema.addPackgeSchema, "body"), packageController.addPackage);
packageRoute.put("/edit-package", auth.authenticate(), validationMiddleware.validate(packageValidation.packageSchema.editPackageSchema, "body"), packageController.editPackageDetails);
packageRoute.put("/delete-package/:package_id", auth.authenticate(), packageController.deletePackage);
packageRoute.get("/package-details/:package_id", packageController.getPackageDetails);
packageRoute.put("/toggle-package/:package_id", auth.authenticate(), packageController.togglePackage);
packageRoute.get("/package-list", auth.authenticate(), packageController.getPackageList);
packageRoute.get("/package-list-web", packageController.getPackagesListForWeb);
packageRoute.post(
    "/company-sign-up",
    uploadFiles(
        [
            { name: "company_logo", maxCount: 1 },
            { name: "gst_certificate", maxCount: 1 },
        ],
        "uploads/companies_logo",
        10000000
    ),
    validationMiddleware.validate(packageValidation.packageSchema.companySignUp, "body"),
    packageController.companySignUp
);
packageRoute.get("/org-type-list", packageController.getOrganizationTypeList);
packageRoute.get("/visitor-count-check", packageController.countCheckForVisitors);
packageRoute.get("/check-active-package", packageController.checkCompanyActivePackage);
packageRoute.get("/features-list/:company_id", auth.authenticate(), packageController.getFeaturesList);
packageRoute.put("/add-wifi-data", auth.authenticate(), validationMiddleware.validate(packageValidation.packageSchema.wifiDetailsSchema, "body"), packageController.addWifiDetails);
packageRoute.get("/get-company-package-details/:company_id", auth.authenticate(), packageController.getCompanyPackageDetails);
// packageRoute.get("/get-company-package-details-for-transaction", auth.authenticate(), packageController.getCompanyPackageDetailsForTransaction);
packageRoute.get("/get-company-package-details-for-transaction/:subscription_id", auth.authenticate(), packageController.getCompanyPackageDetailsForTransaction);

packageRoute.post("/add-contact-us-details", validationMiddleware.validate(packageValidation.packageSchema.contactUsSchema, "body"), packageController.addContactUsDetails);
packageRoute.get("/get-company-details/:company_id", packageController.getCompanyDetails);
packageRoute.put("/update-features", auth.authenticate(), packageController.toggleFeatures);
packageRoute.get("/get-wifi-details", auth.authenticate(), packageController.getWifiDetails);

module.exports = packageRoute;
