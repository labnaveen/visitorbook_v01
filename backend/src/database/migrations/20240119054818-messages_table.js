'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      language_code: {
        allowNull: false, 
        type: Sequelize.STRING(),
        unique: true
      },
      messages: {
        allowNull: false, 
        type: Sequelize.STRING,
        unique: true
      },
      message_type_id: {
        allowNull: false, 
        type: Sequelize.INTEGER,
        unique: true
      },
      

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};