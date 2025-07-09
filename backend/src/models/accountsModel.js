const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const Accounts = sequelize.define(
    "Accounts",
    {
        // Define the model attributes (columns)

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        mobile: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        is_email_verify: {
            allowNull: false,
            type: Sequelize.TINYINT,
            defaultValue: 0,
        },
        is_mobile_verify: {
            allowNull: false,
            type: Sequelize.TINYINT,
            defaultValue: 0,
        },
        country_code: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        language: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        user_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        google_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        fb_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        apple_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        signup_by: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        user_hash: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        password: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        is_first_password_changed: {
            allowNull: true,
            type: Sequelize.TINYINT,
            defaultValue: 0,
        },
        is_blocked: {
            allowNull: false,
            type: Sequelize.STRING,
            defaultValue: 0,
        },

        allowed_logins_in_web: {
            allowNull: false,
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        allowed_login_in_mobile: {
            allowNull: false,
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        profile_image: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        dob: {
            allowNull: true,
            type: Sequelize.DATEONLY,
        },
        gender: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
    },
    {
        // Define additional options for the model
        tableName: "accounts", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = Accounts;
