const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const Roles = sequelize.define('Roles', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING(50)
  },
  display_name: {
    allowNull: false,
    type: Sequelize.STRING(50)
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
    tableName: 'roles', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = Roles;
