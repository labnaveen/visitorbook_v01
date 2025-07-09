"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("stripe_package", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            stripe_package_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            stripe_package_price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            stripe_product_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            stripe_price_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            validity_in_days: {
                allowNull: false,
                type: Sequelize.INTEGER,
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
            is_StripePackage_enabled: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1,
            },
            user_base: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("stripe_package");
    },
};
