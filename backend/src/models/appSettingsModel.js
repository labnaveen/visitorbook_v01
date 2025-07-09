const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const AppSettings = sequelize.define('AppSettings', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  company_id: {
    allowNull: false,
    type: Sequelize.TINYINT,
    references:{
      model: 'companies',
      key: 'id'
    }
  },
  is_display_visitor_face_capture_option: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  is_display_car_parking_option: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  is_display_wifi_access_option: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  is_display_id_proof_capture_option: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  is_display_digital_card: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  is_display_print_visitor_card: {
    allowNull: false,
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  wifi_name: {
    allowNull: true,
    type: Sequelize.STRING(20)
  },
  wifi_password: {
    allowNull: true,
    type: Sequelize.STRING(20)
  },
  deleted_at: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
},
  {
    // Define additional options for the model
    tableName: 'app_settings', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    createdAt: "created_at", // If you want to give a custom name to the createdAt column
    updatedAt: "updated_at",
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });

module.exports = AppSettings;
