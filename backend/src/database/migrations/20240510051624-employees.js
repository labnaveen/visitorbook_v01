"use strict";

const { allow } = require('joi');
/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require("sequelize");
const { defaultValueSchemable } = require('sequelize/lib/utils');

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("employees", {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_id: {
        allowNull: false,
        autoIncrement: false,
        type: DataTypes.INTEGER,
      },
      role_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      middlename: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      phone_prefix: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(),
        allowNull: true,
      },
      department_id: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(),
        allowNull: true
      },
      language_id: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 1
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE(),
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
    await queryInterface.dropTable("employees");
  },
};
