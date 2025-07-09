"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("credit_card_details", "created_at", {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.addColumn("credit_card_details", "deleted_at", {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.addColumn("credit_card_details", "updated_at", {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("credit_card_details", "created_at");
        await queryInterface.removeColumn("credit_card_details", "deleted_at");
        await queryInterface.removeColumn("credit_card_details", "updated_at");
    },
};
