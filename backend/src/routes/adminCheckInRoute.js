const adminCheckInRoute = require("express").Router();
const adminCheckInController = require("../controllers/adminCheckInController");
const adminCheckInValidation = require("../JoiValidations/adminCheckInSchema");
const validationMiddleware = require("../middlewares/validateRequest");
const auth = require("../middlewares/auth");

adminCheckInRoute.post(
    "/add-check-in-details",
    auth.authenticate(),
    validationMiddleware.validate(adminCheckInValidation.adminCheckInSchema.addCheckInCredentials, "body"),
    adminCheckInController.addCheckinCredentials
);
adminCheckInRoute.put(
    "/update-check-in-details",
    auth.authenticate(),
    validationMiddleware.validate(adminCheckInValidation.adminCheckInSchema.updateCheckInCredentials, "body"),
    adminCheckInController.updateCheckinCredentials
);
adminCheckInRoute.get("/get-check-in-details/:company_id", auth.authenticate(), adminCheckInController.getCheckInDetails);
adminCheckInRoute.get("/get-check-in-details-list/:company_id", auth.authenticate(), adminCheckInController.getCheckInDetailsList);
adminCheckInRoute.put("/send-otp", validationMiddleware.validate(adminCheckInValidation.adminCheckInSchema.sendOtp, "body"), auth.authenticate(), adminCheckInController.sendOtp);
adminCheckInRoute.post("/verify-otp", validationMiddleware.validate(adminCheckInValidation.adminCheckInSchema.verifyOtp, "body"), auth.authenticate(), adminCheckInController.verifyOtp);
adminCheckInRoute.get("/get-features-list", auth.authenticate(), adminCheckInController.getFeaturesList);
adminCheckInRoute.get("/get-features-value", auth.authenticate(), adminCheckInController.getFetauresValue);
adminCheckInRoute.get("/get-features-list-visitor/:company_id", auth.authenticate(), adminCheckInController.getFetauresListForVisitorModule);

module.exports = adminCheckInRoute;
