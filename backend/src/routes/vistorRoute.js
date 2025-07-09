const visitorRoute = require("express").Router();
const visitorController = require("../controllers/VisitorController");
const validationMiddleware = require("../middlewares/validateRequest");
const auth = require("../middlewares/auth");
const visitorValidationSchema = require("../JoiValidations/visitorValidationJoiSchema");
const upload = require("../middlewares/imageUploader");
const uploadImagesHelper = require("../middlewares/imagesUploader");
const permissions = require("../middlewares/Permissions");
// visitorRoute.get("/", (req, res) => {
//   console.log(">>>>>>here");
//   res.send("Welcome in vistor sub route");
// });
visitorRoute.post("/check-in", validationMiddleware.validate(visitorValidationSchema.visitorDetailsSchema.login, "body"), visitorController.checkIn);
visitorRoute.post("/upload-visitor-image", auth.authenticate(), upload.uploadImage.single("image"), visitorController.uploadImage);
visitorRoute.get("/get-visitor-details/:id", auth.authenticate(), visitorController.fetchVisitorDetails);
visitorRoute.get("/get-employees-list/:departmentId", auth.authenticate(), visitorController.showEmployeeList);
visitorRoute.get("/get-companies-list", auth.authenticate(), visitorController.showCompanyList);
visitorRoute.post(
    "/add-visitor-info",
    auth.authenticate(),
    validationMiddleware.validate(visitorValidationSchema.visitorDetailsSchema.visitorInformation, "body"),
    visitorController.saveVisitorDetails
);
visitorRoute.post("/upload-idproofs-images", auth.authenticate(), uploadImagesHelper.uploadMultipleFiles("public/visitor_id_proofs_images"), visitorController.uploadIdProofsImages);
visitorRoute.get("/search-visitor-details/:mobile", auth.authenticate(), visitorController.getVisitorDetails);
visitorRoute.post("/mobile-check-in", validationMiddleware.validate(visitorValidationSchema.visitorDetailsSchema.mobileCheckIn, "body"), visitorController.mobileCheckIn);

module.exports = visitorRoute;
