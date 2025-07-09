"use strict";

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require("sequelize");

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("companies", {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        // type: Sequelize.UUID,
        type: DataTypes.INTEGER(),
      },

      code: {
        type: DataTypes.STRING(),
        allowNull: false,
      },

      picture: {
        type: DataTypes.STRING(),
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING(),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(),
        allowNull: false,
      },

      status: {
        type: DataTypes.TINYINT(),
        allowNull: false,
      },

      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE(),
        defaultValue: null,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("companies");
  },
};
