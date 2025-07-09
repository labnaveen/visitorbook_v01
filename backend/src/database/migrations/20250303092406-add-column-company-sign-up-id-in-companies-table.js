"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("companies", "companies_sign_up_details_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "company_sign_up_details",
                key: "id",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("companies", "companies_sign_up_details_id");
    },
};
