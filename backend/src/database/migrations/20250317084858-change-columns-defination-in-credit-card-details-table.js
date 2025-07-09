"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("credit_card_details", "card_number");
        await queryInterface.removeColumn("credit_card_details", "cvv");

        await queryInterface.addColumn("credit_card_details", "payment_method_id", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("credit_card_details", "card_number", {
            type: Sequelize.INTEGER,
            allowNull: false,
        });

        await queryInterface.addColumn("credit_card_details", "cvv", {
            type: Sequelize.INTEGER,
            allowNull: false,
        });

        await queryInterface.removeColumn("credit_card_details", "payment_method_id");
    },
};
