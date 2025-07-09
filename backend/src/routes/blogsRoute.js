const blogsRoute = require("express").Router();
const blogController = require("../controllers/blogsController");
const validationMiddleware = require("../middlewares/validateRequest");
const { blogsValidationSchema } = require("../JoiValidations");
const uploadImagesHelper = require("../middlewares/imagesUploader");
const auth = require("../middlewares/auth");

blogsRoute.post(
    "/add-blog",
    auth.authenticate(),
    uploadImagesHelper.uploadMultipleFiles("uploads/blogs_images"),
    validationMiddleware.validate(blogsValidationSchema.addBlog, "body"),
    blogController.addBlog
);
blogsRoute.put(
    "/edit-blog/:id",
    auth.authenticate(),
    uploadImagesHelper.uploadMultipleFiles("uploads/blogs_images"),
    validationMiddleware.validate(blogsValidationSchema.editBlog, "body"),
    blogController.editBlog
);
blogsRoute.get("/get-blog-details/:slug", blogController.getBlogDetails);
blogsRoute.delete("/delete-blog/:id", auth.authenticate(), blogController.deleteBlog);
blogsRoute.get("/get-blogs-list", blogController.getBlogsList);

module.exports = blogsRoute;
