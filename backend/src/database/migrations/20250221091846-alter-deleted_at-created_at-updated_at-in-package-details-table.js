"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("package_details", "created_at", {
            allowNull: true,
            type: Sequelize.DATE,
        });
        await queryInterface.changeColumn("package_details", "deleted_at", {
            allowNull: true,
            type: Sequelize.DATE,
        });
        await queryInterface.changeColumn("package_details", "updated_at", {
            allowNull: true,
            type: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("package_details", "created_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.changeColumn("package_details", "deleted_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.changeColumn("package_details", "updated_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
    },
};
