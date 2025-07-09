const { allow } = require("joi");
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const RazorPaySubscriptionAndPackageMap = sequelize.define(
    "RazorPaySubscriptionAndPackageMap",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },

        package_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },

        company_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },

        subscription_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        is_camera_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_id_proof_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_wifi_checkbox_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_car_parking_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_display_visitor_card_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_print_visitor_card_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_data_export_available: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_digital_log_visible: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_report_export_available: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    },
    {
        // Define additional options for the model
        tableName: "razorpay_subscription_and_package_map", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = RazorPaySubscriptionAndPackageMap;
