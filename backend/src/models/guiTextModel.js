const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const GuiText = sequelize.define('GuiText', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  language_id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'languages',
      key: 'id'
    }
  },
  application_id: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  text: {
    allowNull: true,
    type: Sequelize.JSON
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
    tableName: 'guitext', // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = GuiText;
