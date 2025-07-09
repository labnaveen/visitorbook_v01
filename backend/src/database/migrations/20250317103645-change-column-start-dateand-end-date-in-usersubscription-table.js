"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Rename columns
        await queryInterface.renameColumn("user_subscription", "start_time", "start_date");
        await queryInterface.renameColumn("user_subscription", "end_time", "end_date");

        // Change column types
        await queryInterface.changeColumn("user_subscription", "start_date", {
            type: Sequelize.DATE, // Change to your desired type
            allowNull: true, // Modify as needed
        });

        await queryInterface.changeColumn("user_subscription", "end_date", {
            type: Sequelize.DATE, // Change to your desired type
            allowNull: true, // Modify as needed
        });
    },

    async down(queryInterface, Sequelize) {
        // Revert column names
        await queryInterface.renameColumn("user_subscription", "start_date", "start_time");
        await queryInterface.renameColumn("user_subscription", "end_date", "end_time");

        // Revert column types
        await queryInterface.changeColumn("user_subscription", "start_time", {
            type: Sequelize.TIME,
            allowNull: false,
        });

        await queryInterface.changeColumn("user_subscription", "end_time", {
            type: Sequelize.TIME,
            allowNull: false,
        });
    },
};
