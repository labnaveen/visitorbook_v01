"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.createTable("company_sign_up_details", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            company_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            company_address: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            company_admin_email: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            company_admin_password: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            organization_type: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            gst_certificate: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            company_logo: {
                allowNull: false,
                type: Sequelize.STRING,
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
        queryInterface.dropTable("company_sign_up_details");
    },
};
