const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const Userotp = sequelize.define('Userotp', {
  // Define the model attributes (columns)
 
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
  otp: {
    allowNull: true, 
    type: Sequelize.INTEGER,
    unique: true
  },
  otp_expired_datetime: {
    allowNull: true, 
    type: Sequelize.DATE,
    unique: true
  },
  
},
  {
    // Define additional options for the model
    tableName: 'otp', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    createdAt: 'created_at',  // If you want to give a custom name to the createdAt column
    updatedAt: 'updated_at',  // If you want to give a custom name to the updatedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = Userotp;