const Joi = require("joi");

const blogsValidationSchema = {};

const commentsValidationSchema = {};

blogsValidationSchema.addBlog = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string().optional(),
    image_alt_text: Joi.string().optional(),
    image_alt_title: Joi.string().optional(),
    canonical_tag: Joi.string().allow(""),
    slug: Joi.string().allow(null, ""), // allow null or empty string
    description: Joi.string().allow(null, ""), // allow null or empty string
});

blogsValidationSchema.editBlog = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string().optional(),
    image_alt_text: Joi.string().optional(),
    image_alt_title: Joi.string().optional(),
    canonical_tag: Joi.string().allow(""),
    slug: Joi.string().allow(null, ""),
    description: Joi.string().allow(null, ""),
});

commentsValidationSchema.addComment = Joi.object().keys({
    blog_id: Joi.number().required(),
    comment: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
});

commentsValidationSchema.updateCommentStatus = Joi.object().keys({
    status: Joi.number().required(),
});
module.exports = {
    blogsValidationSchema,
    commentsValidationSchema,
};
