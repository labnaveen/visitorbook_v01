"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableDescription = await queryInterface.describeTable("razorpay_transaction");
        if (tableDescription.package_id) {
            await queryInterface.removeColumn("razorpay_transaction", "package_id");
            await queryInterface.removeColumn("razorpay_transaction", "company_id");
        } else {
            console.log("Columns package_id and company_id do not exists. Skipping migration... ");
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("razorpay_transaction", "package_id", {
            type: Sequelize.INTEGER,
            references: {
                model: "package",
                key: "id",
            },
        });

        await queryInterface.addColumn("razorpay_transaction", "company_id", {
            allowNull: false,
            type: Sequelize.INTEGER,
        });
    },
};
