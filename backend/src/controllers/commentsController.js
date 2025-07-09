const { stat } = require("fs");
const ResponseHelper = require("../helpers/ResponseHelper");
const Comments = require("../models/commentsModel");
const sanitizeHtml = require("sanitize-html");
const { sequelize } = require("../config/db.config");

module.exports.addComment = async (req, res) => {
    try {
        const { blog_id, comment, name, email } = req.body;

        if (!blog_id || !comment) {
            return ResponseHelper.BadRequest(res, "blog_id and comment are required.");
        }

        const newComment = await Comments.create({
            blog_id,
            comment,
            commentator_name: name,
            commentator_email: email,
            is_approved: 0,
        });

        return ResponseHelper.OK(res, true, "Comment added successfully!", newComment, null, "Add Comment Api");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Add Comment API!");
    }
};

module.exports.getCommentsByBlogId = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const is_approved = req.query.is_approved;

        if (!blog_id) {
            return ResponseHelper.BadRequest(res, "Blog Id is required in params.");
        }

        const whereCondition = { blog_id };

        if (is_approved !== undefined) {
            const approvalStatus = parseInt(is_approved);
            if ([0, 1, 2].includes(approvalStatus)) {
                whereCondition.is_approved = approvalStatus;
            } else {
                return ResponseHelper.BadRequest(res, "Invalid is_approved value. Must be 0, 1, or 2.");
            }
        }

        const { rows: comments, count: totalCount } = await Comments.findAndCountAll({
            where: whereCondition,
            order: [["created_at", "DESC"]],
            limit,
            offset,
        });
        const meta = {
            totalCount,
            page,
            perPage: limit,
            pageCount: Math.ceil(totalCount / limit),
            hasNextPage: offset + limit < totalCount,
            hasPrevPage: page > 1,
        };

        return ResponseHelper.OK(res, true, "Comments fetched successfully!", comments, meta, "Get Comment Approval Counts API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Comments API!");
    }
};
module.exports.getCommentApprovalCounts = async (req, res) => {
    try {
        const { blog_id } = req.params;

        if (!blog_id) {
            return ResponseHelper.BadRequest(res, "Blog Id is required in params.");
        }

        const counts = await Comments.findAll({
            attributes: ["is_approved", [sequelize.fn("COUNT", sequelize.col("is_approved")), "count"]],
            where: { blog_id },
            group: ["is_approved"],
            raw: true,
        });

        const result = {
            0: 0,
            1: 0,
            2: 0,
        };

        counts.forEach((item) => {
            result[item.is_approved] = parseInt(item.count);
        });

        return ResponseHelper.OK(res, true, "Approval counts fetched successfully!", result, null, "Get Comment Approval Counts API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Comment Approval Counts API!");
    }
};

module.exports.approveComments = async (req, res) => {
    try {
        let { id } = req.params;
        let { status } = req.body;

        const sanitizedStatus = parseInt(sanitizeHtml(String(status)));

        if (![0, 1, 2].includes(sanitizedStatus)) {
            return ResponseHelper.BadRequest(res, "Invalid status value", "Comments Approve API!");
        }

        const commentStatus = await Comments.findOne({
            where: { id },
        });

        if (commentStatus?.is_approved === 0) {
            await Comments.update({ is_approved: sanitizedStatus }, { where: { id } });
        }

        return ResponseHelper.OK(res, true, "Comments Status Updated successfully!", null, null, "Comments Approve API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Comments Approve API!");
    }
};

module.exports.getApprovedCommentsList = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (!blog_id) {
            return ResponseHelper.BadRequest(res, "blog_id is required in params.");
        }

        const { rows: comments, count: totalCount } = await Comments.findAndCountAll({
            where: {
                blog_id,
                is_approved: 1,
            },
            order: [["created_at", "DESC"]],
            limit,
            offset,
        });

        const meta = {
            totalCount,
            page,
            perPage: limit,
            pageCount: Math.ceil(totalCount / limit),
            hasNextPage: offset + limit < totalCount,
            hasPrevPage: page > 1,
        };

        return ResponseHelper.OK(res, true, "Approval comments fetched successfully!", comments, meta, "Get Approved Comments API!");
    } catch (error) {
        return ResponseHelper.ISError(res, error.message, "Get Approved Comments API");
    }
};
