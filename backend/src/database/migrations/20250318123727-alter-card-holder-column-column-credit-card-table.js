"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("credit_card_details", "expiry_Date", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("credit_card_details", "expiry_date", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },
};
