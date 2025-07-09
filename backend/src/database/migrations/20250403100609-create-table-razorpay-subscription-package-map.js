"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("razorpay_subscription_and_package_map", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            package_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },

            company_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },

            subscription_id: {
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
        await queryInterface.dropTable("razorpay_subscription_and_package_map");
    },
};
