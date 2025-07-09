'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_login', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      fcm: {
        allowNull: true,
        type: Sequelize.STRING
      },

      role: {
        allowNull: true,
        type: Sequelize.STRING

      },

      device_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      device_name: {
        allowNull: true,
        type: Sequelize.STRING(20),
      },
      ip_address: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING(8),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_login');
  }
};