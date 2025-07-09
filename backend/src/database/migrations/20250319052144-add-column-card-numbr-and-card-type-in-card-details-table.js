"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("credit_card_details", "card_number", {
            allowNull: true,
            type: Sequelize.STRING,
        }),
            await queryInterface.addColumn("credit_card_details", "card_type", {
                allowNull: true,
                type: Sequelize.STRING,
            });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("credit_card_details", "card_number");
        await queryInterface.removeColumn("credit_card_details", "card_type");
    },
};
