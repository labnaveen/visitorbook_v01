"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("company_package_details", "is_data_export_available", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addColumn("company_package_details", "is_digital_log_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addColumn("company_package_details", "is_report_export_available", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("company_package_details", "is_data_export_available");
        await queryInterface.removeColumn("company_package_details", "is_digital_log_visible");
        await queryInterface.removeColumn("company_package_details", "is_report_export_available");
    },
};
