const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const Comments = sequelize.define(
    "Comments",
    {
        // Define the model attributes (columns)

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(),
        },
        blog_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        commentator_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        commentator_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_approved: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        // Define additional options for the model
        tableName: "comments", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = Comments;
