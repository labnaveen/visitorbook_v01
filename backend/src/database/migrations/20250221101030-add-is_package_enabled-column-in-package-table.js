"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("package", "is_package_enabled", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("package", "is_package_enabled");
    },
};
