"use strict";

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn("transaction", "company_id", {
            allowNull: true,
            type: Sequelize.INTEGER,
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn("transaction", "company_id");
    },
};
