"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.changeColumn("employees", "picture", {
            allowNull: true,
            type: Sequelize.STRING,
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.changeColumn("employees", "picture", {
            allowNull: false,
            type: Sequelize.STRING,
        });
    },
};
