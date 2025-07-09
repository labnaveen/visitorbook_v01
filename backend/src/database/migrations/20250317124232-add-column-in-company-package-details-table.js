"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn("company_package_details", "wifi_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        queryInterface.addColumn("company_package_details", "wifi_password", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn("company_package_details", "wifi_name");
        queryInterface.removeColumn("company_package_details", "wifi_password");
    },
};
