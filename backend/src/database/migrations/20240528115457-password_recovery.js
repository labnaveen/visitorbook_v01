"use strict";

/** @type {import('sequelize-cli').Migration} */
const { DataTypes, Sequelize } = require("sequelize");


// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("password_recovery", {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'employees', // Replace with your user table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      otp: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      sent_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      expired_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      is_used: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // Additional columns as per your requirements
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },




    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("password_recovery");
  },
};
