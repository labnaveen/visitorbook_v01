"use strict";

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("departments", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(50),
            },
            display_name: {
                allowNull: false,
                type: Sequelize.STRING(50),
            },
            color: {
                allowNull: false,
                type: Sequelize.STRING(50),
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("departments");
    },
};
