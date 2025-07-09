"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("package", "created_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });

        await queryInterface.addColumn("package", "deleted_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
        await queryInterface.addColumn("package", "updated_at", {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("package", "created_at");
        await queryInterface.removeColumn("package", "deleted_at");
        await queryInterface.removeColumn("package", "updated_at");
    },
};
