'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('visitors', 'id_proof1', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
    await queryInterface.addColumn('visitors', 'id_proof2', {
      type: Sequelize.STRING(50),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('visitors', 'id_proof1');
    await queryInterface.removeColumn('visitors', 'id_proof2');
  }
};