"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("company_check_in_details", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            company_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "companies",
                    key: "id",
                },
            },
            check_in_email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            check_in_password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("company_check_in_details");
    },
};
