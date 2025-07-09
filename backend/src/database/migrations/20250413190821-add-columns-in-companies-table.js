"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("companies", "comment", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("companies", "duration", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("companies", "comment");
        await queryInterface.removeColumn("companies", "duration");
    },
};
