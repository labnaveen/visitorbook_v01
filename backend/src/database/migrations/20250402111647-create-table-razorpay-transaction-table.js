"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("razorpay_transaction", {
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
            amount: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_method: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            order_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            transaction_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 4,
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
        await queryInterface.dropTable("razorpay_transaction");
    },
};
