"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add two columns: comment_type (STRING) and is_flagged (BOOLEAN)
        await queryInterface.addColumn("comments", "commentator_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("comments", "commentator_email", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the columns on rollback
        await queryInterface.removeColumn("comments", "commentator_name");
        await queryInterface.removeColumn("comments", "commentator_email");
    },
};
