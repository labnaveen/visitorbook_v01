"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("package_details", "created_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });

        await queryInterface.addColumn("package_details", "deleted_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.addColumn("package_details", "updated_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("package_details", "created_at");
        await queryInterface.removeColumn("package_details", "deleted_at");
        await queryInterface.removeColumn("package_details", "updated_at");
    },
};
