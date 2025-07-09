const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const Messages = sequelize.define('Messages', {
  // Define the model attributes (columns)
 
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  language_code: {
    allowNull: false, 
    type: Sequelize.STRING,
    unique: true
  },
  messages: {
    allowNull: false, 
    type: Sequelize.STRING,
    unique: true
  },
  message_type_id: {
    allowNull: false, 
    type: Sequelize.INTEGER,
    unique: true
  },
},
  {
    // Define additional options for the model
    tableName: 'messages', // Specify the table name
    // timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: true, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = Messages;
