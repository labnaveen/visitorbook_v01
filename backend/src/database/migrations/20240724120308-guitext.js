'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("guitext", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      language_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'languages',
          key: 'id'
        }
      },
      application_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      text: {
        allowNull: true,
        type: Sequelize.JSON
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("guitext");
  }
};
