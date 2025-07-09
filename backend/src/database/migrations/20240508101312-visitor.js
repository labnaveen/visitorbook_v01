"use strict";
const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("visitors", {


      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        // type: Sequelize.UUID,
        type: Sequelize.INTEGER(),
      },

      company_id: {
        allowNull: false,
        type: Sequelize.INTEGER(),
      },
      employee_id: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },


      image: {
        allowNull: false,
        type: Sequelize.STRING(),
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },

      phone_prefix: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      phone_number: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },

      email: {
        allowNull: false,
        type: Sequelize.STRING(),
      },

      reason: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },

      company: {
        allowNull: true,
        type: Sequelize.STRING(),
      },

      status: {
        type: Sequelize.TINYINT(),
        allowNull: true,
      },

      vehicle_registration_number: {
        type: Sequelize.STRING(),
        allowNull: false
      },

      deleted_at: {
        allowNull: false,
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      is_visitor_details_saved: {
        allowNull: true,
        type: Sequelize.TINYINT(),
        defaultValue: 0,
      },

      is_wifi_access_provided: {
        allowNull: true,
        type: DataTypes.TINYINT(),
        defaultValue: 0,
      },

      is_car_parked: {
        allowNull: true,
        type: DataTypes.TINYINT(),
        defaultValue: 0,
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("visitors");
  },
};
