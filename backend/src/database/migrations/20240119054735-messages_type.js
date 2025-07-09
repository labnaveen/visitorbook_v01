'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messagestype', {
      
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_type: {
        allowNull: true, 
        type: Sequelize.STRING,
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messagestype');
  }
};