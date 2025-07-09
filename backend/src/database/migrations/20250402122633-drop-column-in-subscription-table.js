"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("razorpay_subscription", "package_id");
        await queryInterface.removeColumn("razorpay_subscription", "company_id");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("razorpay_subscription", "package_id", {
            type: Sequelize.INTEGER,
            references: {
                model: "package",
                key: "id",
            },
        });

        await queryInterface.addColumn("razorpay_subscription", "company_id", {
            allowNull: false,
            type: Sequelize.INTEGER,
        });
    },
};
