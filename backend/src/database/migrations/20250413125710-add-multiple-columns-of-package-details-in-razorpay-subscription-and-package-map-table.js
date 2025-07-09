"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_camera_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });

        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_id_proof_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });

        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_wifi_checkbox_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_car_parking_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_display_visitor_card_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_print_visitor_card_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });

        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_data_export_available", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_digital_log_visible", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        await queryInterface.addColumn("razorpay_subscription_and_package_map", "is_report_export_available", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_camera_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_report_export_available");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_digital_log_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_print_visitor_card_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_display_visitor_card_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_car_parking_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_wifi_checkbox_visible");
        await queryInterface.removeColumn("razorpay_subscription_and_package_map", "is_id_proof_visible");
    },
};
