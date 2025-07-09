const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const Blogs = sequelize.define(
    "Blogs",
    {
        // Define the model attributes (columns)

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(),
        },
        blog_title: {
            allowNull: false,
            type: DataTypes.STRING(250),
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        content: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        canonical_tag: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_alt_text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image_alt_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        // Define additional options for the model
        tableName: "blogs", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = Blogs;
