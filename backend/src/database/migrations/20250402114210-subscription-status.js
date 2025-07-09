"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("subscription_status", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            subscription_status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("subscription_status");
    },
};
