"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add two columns: comment_type (STRING) and is_flagged (BOOLEAN)
        await queryInterface.addColumn("blogs", "image_alt_text", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("blogs", "image_alt_title", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the columns on rollback
        await queryInterface.removeColumn("blogs", "image_alt_text");
        await queryInterface.removeColumn("blogs", "image_alt_title");
    },
};
