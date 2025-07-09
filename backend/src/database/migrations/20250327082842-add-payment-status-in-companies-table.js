"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn("companies", "payment_status", {
            type: Sequelize.TINYINT(),
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn("companies", "payment_status");
    },
};
