const { Op, Sequelize } = require("sequelize");
const ResponseHelper = require("../helpers/ResponseHelper");
const Blogs = require("../models/blogsModel");
const sanitizeHtml = require("sanitize-html");
const Comments = require("../models/commentsModel");
const { log } = require("console");
const sequelize = require("../config/db.config").sequelize;

module.exports.addBlog = async (req, res) => {
    try {
        let { title, content, image_alt_text, image_alt_title, canonical_tag, slug, description } = req.body;
        title = sanitizeHtml(title);
        slug = slug ? sanitizeHtml(slug) : null;
        description = description ? sanitizeHtml(description) : null;

        let image = req.files;
        const uploadedFile = image[0];

        const blogData = {
            blog_title: title,
            content: content,
            image: uploadedFile?.filename,
            image_alt_text: image_alt_text,
            image_alt_title: image_alt_title,
            canonical_tag: canonical_tag,
            slug: slug,
            description: description,
        };

        const addedBlog = await Blogs.create(blogData);
        if (addedBlog) {
            return ResponseHelper.OK(res, true, "Blog Added successfully!", null, null, "Add Blog API!");
        }
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Add Blog API!");
    }
};

module.exports.editBlog = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, content, image_alt_text, image_alt_title, canonical_tag, slug, description } = req.body;

        title = sanitizeHtml(title);
        slug = slug ? sanitizeHtml(slug) : null;
        description = description ? sanitizeHtml(description) : null;
        id = sanitizeHtml(id);

        const checkBlogExists = await Blogs.findOne({ where: { id } });
        if (!checkBlogExists) {
            return ResponseHelper.NotFound(res, false, "Blog does not exist!", "Edit Blog API!");
        }

        let image = checkBlogExists?.image;

        if (req.files && req.files.length > 0) {
            image = req.files[0].filename;
        }

        const blogData = {
            blog_title: title,
            content: content,
            image: image,
            image_alt_text: image_alt_text,
            image_alt_title: image_alt_title,
            canonical_tag: canonical_tag,
            slug: slug,
            description: description,
        };

        const [updatedCount] = await Blogs.update(blogData, { where: { id } });

        if (updatedCount) {
            return ResponseHelper.OK(res, true, "Blog Updated successfully!", null, null, "Edit Blog API!");
        } else {
            return ResponseHelper.ServerError(res, false, "Failed to update blog.", "Edit Blog API!");
        }
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Edit Blog API!");
    }
};

module.exports.deleteBlog = async (req, res) => {
    let t;
    try {
        const id = req.params.id;

        t = await sequelize.transaction();

        const deletedComments = await Comments.destroy({
            where: { blog_id: id },
            transaction: t,
        });

        let deletedBlog;
        deletedBlog = await Blogs.destroy({
            where: { id },
            transaction: t,
        });

        if (deletedBlog) {
            await t.commit();
            return ResponseHelper.OK(res, true, "Blog and its comments deleted successfully!", null, null, "Delete Blog API!");
        } else {
            await t.rollback();
            return ResponseHelper.NotFound(res, false, "Blog not found!", "Delete Blog API!");
        }
    } catch (error) {
        if (t) {
            await t.rollback();
        }
        return ResponseHelper.ISError(res, error.message, "Delete Blog API!");
    }
};

module.exports.getBlogDetails = async (req, res) => {
    try {
        const slug = req.params.slug;
        const blog = await Blogs.findOne({ where: { slug } });

        if (!blog) {
            return ResponseHelper.NotFound(res, false, "Blog not found!", "Get Blog Details API!");
        }

        return ResponseHelper.OK(res, true, "Blog fetched successfully!", blog, null, "Get Blog Details API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Blog Details API!");
    }
};
module.exports.getBlogsList = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const offset = (page - 1) * limit;

        const searchCondition = search
            ? {
                  [Op.or]: [
                      { blog_title: { [Op.like]: `%${search}%` } }, // Change to Op.like
                      { content: { [Op.like]: `%${search}%` } }, // Change to Op.like
                      { created_at: { [Op.like]: `%${search}%` } },
                  ],
              }
            : {};

        const { count, rows } = await Blogs.findAndCountAll({
            where: searchCondition,
            offset,
            limit,
            order: [["created_at", "DESC"]],
        });

        const totalPages = Math.ceil(count / limit);
        const meta = {
            totalCount: count,
            currentPage: page,
            totalPages: totalPages,
            perPage: limit,
        };

        return await ResponseHelper.OK(res, true, "Blogs List fetched successfully!", rows, meta, "Update app settings API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Blogs List API!");
    }
};
