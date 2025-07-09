const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const MessagesType = sequelize.define('MessagesType', {
  // Define the model attributes (columns)
 
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  message_type: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
},
  {
    // Define additional options for the model
    tableName: 'messagestype', // Specify the table name
    // timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: true, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = Messages;
