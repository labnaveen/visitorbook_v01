"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payment_status", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            payment_status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("payment_status");
    },
};
