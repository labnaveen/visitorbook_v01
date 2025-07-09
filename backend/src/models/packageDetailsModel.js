const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const PackageDetails = sequelize.define(
    "PackageDetails",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        package_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "package",
                key: "id",
            },
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
    },
    {
        tableName: "package_details",
        timestamps: true,
        paranoid: true,
        underscored: true,
    }
);

module.exports = PackageDetails;
