"use strict";

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("app_settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_id: {
        allowNull: false,
        type: Sequelize.TINYINT
      },
      is_display_visitor_face_capture_option: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      is_display_car_parking_option: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      is_display_wifi_access_option: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      is_display_id_proof_capture_option: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      is_display_digital_card: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 1
      },
      is_display_print_visitor_card: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("app_settings");
  },
};
