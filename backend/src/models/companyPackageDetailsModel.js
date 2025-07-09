const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;
const CompanyPackageDetails = sequelize.define(
    "CompanyPackageDetails",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        company_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: "companies",
                key: "id",
            },
        },
        package_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        is_camera_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_id_proof_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_wifi_checkbox_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_car_parking_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_display_visitor_card_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_print_visitor_card_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
        is_data_export_available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_digital_log_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_report_export_available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        wifi_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        wifi_password: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        is_package_valid: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
    },
    {
        tableName: "company_package_details", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = CompanyPackageDetails;
