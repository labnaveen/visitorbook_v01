"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("razorpay_subscription", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            package_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "package",
                    key: "id",
                },
            },
            subscription_status_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 4,
            },
            plan_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subscription_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            customer_id: {
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
            company_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("razorpay_subscription");
    },
};
