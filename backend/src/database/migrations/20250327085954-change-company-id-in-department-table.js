"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("departments", "company_id", {
            allowNull: true,
            type: DataTypes.INTEGER(),
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("departments", "company_id", {
            allowNull: false,
            type: Sequelize.TINYINT,
            references: {
                model: "companies",
                key: "id",
            },
        });
    },
};
