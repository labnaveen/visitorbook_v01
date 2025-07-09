"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("razorpay_subscription", "package_id", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });

        await queryInterface.addColumn("razorpay_subscription", "company_id", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });

        await queryInterface.addColumn("razorpay_subscription", "package_name", {
            allowNull: true,
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn("razorpay_subscription", "package_price", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
        await queryInterface.addColumn("razorpay_subscription", "validity_in_days", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
        await queryInterface.addColumn("razorpay_subscription", "user_base", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("razorpay_subscription", "package_id");
        await queryInterface.removeColumn("razorpay_subscription", "company_id");
        await queryInterface.removeColumn("razorpay_subscription", "package_name");
        await queryInterface.removeColumn("razorpay_subscription", "package_price");
        await queryInterface.removeColumn("razorpay_subscription", "validity_in_days");
        await queryInterface.removeColumn("razorpay_subscription", "user_base");
    },
};
