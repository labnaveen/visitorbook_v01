const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const Languages = sequelize.define('Languages', {
  // Define the model attributes (columns)
  id: {
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  language: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true
  },
  code: {
    primaryKey: true,
    allowNull: true,
    type: Sequelize.STRING,
    unique: true
  },
},
  {
    // Define additional options for the model
    tableName: 'languages', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: true, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = Languages;
