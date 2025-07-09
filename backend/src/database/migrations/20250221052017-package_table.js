"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("package", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            package_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            package_price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            validity_in_days: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("package");
    },
};
