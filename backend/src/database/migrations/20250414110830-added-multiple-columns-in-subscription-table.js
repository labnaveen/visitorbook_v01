"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("razorpay_subscription", "next_payment_date", {
            type: Sequelize.DATE,
            allowNull: true,
        });

        await queryInterface.addColumn("razorpay_subscription", "susbscription_type", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("razorpay_subscription", "next_payment_date");
        await queryInterface.removeColumn("razorpay_subscription", "susbscription_type");
    },
};
