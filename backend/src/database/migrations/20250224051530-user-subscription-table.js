"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.createTable("user_subscription", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            company_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "companies",
                    key: "id",
                },
            },
            package_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "package",
                    key: "id",
                },
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
            start_time: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            end_time: {
                type: Sequelize.TIME,
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
            is_package_enabled: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        queryInterface.dropTable("user_subscription");
    },
};
