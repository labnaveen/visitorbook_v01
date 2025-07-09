"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.changeColumn("company_sign_up_details", "company_logo", {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.changeColumn("company_sign_up_details", "company_logo", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },
};
