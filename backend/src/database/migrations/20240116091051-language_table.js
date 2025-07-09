'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('languages', {
      id: {
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING(20),
        unique: true
      },
      code: {
        primaryKey: true,
        allowNull: true,
        type: Sequelize.STRING(8),
        unique: true
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('languages');
  }
};