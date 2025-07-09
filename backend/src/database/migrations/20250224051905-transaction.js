"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("transaction", {
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
            razorpay_order_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 1,
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
        queryInterface.dropTable("transaction");
    },
};
