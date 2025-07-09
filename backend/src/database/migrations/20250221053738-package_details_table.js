"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("package_details", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            package_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "package",
                    key: "id",
                },
            },
            is_camera_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_id_proof_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_wifi_checkbox_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_car_parking_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_display_visitor_card_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_print_visitor_card_visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("package_details");
    },
};
