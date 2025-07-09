const commentsRoute = require("express").Router();
const commentsController = require("../controllers/commentsController");
const validationMiddleware = require("../middlewares/validateRequest");
const auth = require("../middlewares/auth");
const { commentsValidationSchema } = require("../JoiValidations");

commentsRoute.post("/add-comment", validationMiddleware.validate(commentsValidationSchema.addComment, "body"), commentsController.addComment);
commentsRoute.get("/get-comment-list/:blog_id", commentsController.getCommentsByBlogId);
commentsRoute.put("/update-comment-status/:id", validationMiddleware.validate(commentsValidationSchema.updateCommentStatus, "body"), commentsController.approveComments);
commentsRoute.get("/get-approved-comments-list/:blog_id", commentsController.getApprovedCommentsList);
commentsRoute.get("/get-comments-count/:blog_id", commentsController.getCommentApprovalCounts);

module.exports = commentsRoute;
