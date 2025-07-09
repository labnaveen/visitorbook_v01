"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add two columns: comment_type (STRING) and is_flagged (BOOLEAN)
        await queryInterface.addColumn("comments", "is_approved", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the columns on rollback
        await queryInterface.removeColumn("comments", "is_approved");
    },
};
