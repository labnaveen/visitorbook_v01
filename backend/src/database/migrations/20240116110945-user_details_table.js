'use strict';

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userdetails', {
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
 
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      email: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      personal_mobile: {
        allowNull: true,
        type: Sequelize.STRING
      },
      emergency_mobile: {
        allowNull: true,
        type: Sequelize.STRING
      },
      personal_mobile_country_code: {
        allowNull: true, 
        type: Sequelize.STRING,
      },
      emergency_mobile_country_code: {
        allowNull: true, 
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      gender: {
        allowNull: true, 
        type: Sequelize.STRING,
      },
      blood_type: {
        allowNull: true, 
        type: Sequelize.STRING,
      },
      id_proof: {
        allowNull: true, 
        type: Sequelize.STRING,
      },
      marital_status: {
        allowNull: true, 
        type: Sequelize.STRING
      },
      language: {
        allowNull: false, 
        type: Sequelize.STRING(8),
        defaultValue:"en"
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userdetails');
  }
};