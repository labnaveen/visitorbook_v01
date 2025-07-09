"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("company_package_details", "is_package_valid", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("company_package_details", "is_package_valid");
    },
};
