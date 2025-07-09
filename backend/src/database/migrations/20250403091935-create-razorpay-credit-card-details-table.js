"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("razorpay_card_details", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            subscription_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            plan_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            customer_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            card_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            card_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            card_network: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            card_color: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("razorpay_card_details");
    },
};
