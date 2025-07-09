"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("organization_type", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            organization_type: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("organization_type");
    },
};
