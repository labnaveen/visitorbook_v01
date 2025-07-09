const { DataTypes, Sequelize } = require("sequelize");
const Companies = require("./companiesModel");
const sequelize = require("../config/db.config").sequelize;
const CompanySignUpDetails = sequelize.define(
    "CompanySignUpDetails",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        company_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        company_address: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        company_admin_email: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        company_admin_password: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        organization_type: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        gst_certificate: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        company_logo: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        gst_number: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        created_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        package_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
    },
    {
        tableName: "company_sign_up_details", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);
// Define associations here

module.exports = CompanySignUpDetails;
