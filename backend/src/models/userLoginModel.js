const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const UserLogin = sequelize.define('UserLogin', {
  // Define the model attributes (columns)

  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  account_id: {
    allowNull: false,
    type: Sequelize.INTEGER
  },

  role: {
    allowNull: false,
    type: Sequelize.STRING()
  },

  token: {
    allowNull: true,
    type: Sequelize.STRING
  },
  fcm: {
    allowNull: true,
    type: Sequelize.STRING
  },
  device_id: {
    allowNull: true,
    type: Sequelize.STRING
  },
  ip_address: {
    allowNull: true,
    type: Sequelize.STRING
  },
  device_name: {
    allowNull: true,
    type: Sequelize.STRING
  },
  language: {
    allowNull: false,
    type: Sequelize.STRING,
  }
},
  {
    // Define additional options for the model
    tableName: 'user_login', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    createdAt: 'created_at',  // If you want to give a custom name to the createdAt column
    updatedAt: 'updated_at',  // If you want to give a custom name to the updatedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = UserLogin;