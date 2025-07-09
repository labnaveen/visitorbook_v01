"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn("transaction", "razorpay_order_id", "stripe_subscription_id", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameColumn("transaction", "stripe_subscription_id", "razorpay_order_id", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },
};
