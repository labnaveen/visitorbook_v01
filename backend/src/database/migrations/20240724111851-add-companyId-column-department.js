'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('departments', 'company_id', {
      type: Sequelize.TINYINT,
      allowNull: false
    });
  
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('departments', 'company_id');
  }
};