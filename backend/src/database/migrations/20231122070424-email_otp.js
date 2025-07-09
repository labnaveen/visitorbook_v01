'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('otp', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        allowNull: false, 
        type: Sequelize.INTEGER,
        unique: true
      },
      otp: {
        allowNull: true, 
        type: Sequelize.INTEGER,
        unique: true
      },
      otp_expired_datetime: {
        allowNull: true, 
        type: Sequelize.DATE,
        unique: true
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
    await queryInterface.dropTable('otp');
  }
};