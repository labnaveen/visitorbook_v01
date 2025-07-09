"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("credit_card_details", {
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
            package_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            card_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            card_holder: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            expiry_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            cvv: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("credit_card_details");
    },
};
