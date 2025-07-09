"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn(
            "stripe_package", // Table name
            "is_StripePackage_enabled", // Old column name
            "is_stripe_package_enabled" // New column name
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameColumn(
            "stripe_package", // Table name
            "is_stripe_package_enabled", // New column name
            "is_StripePackage_enabled" // Reverting to old column name
        );
    },
};
