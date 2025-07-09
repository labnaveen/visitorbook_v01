"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("company_sign_up_details", "gst_number", {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("company_sign_up_details", "gst_number");
    },
};
