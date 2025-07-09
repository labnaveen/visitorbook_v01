'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('app_settings', 'wifi_name', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
    await queryInterface.addColumn('app_settings', 'wifi_password', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('app_settings', 'wifi_name');
    await queryInterface.removeColumn('app_settings', 'wifi_password');
  }
};