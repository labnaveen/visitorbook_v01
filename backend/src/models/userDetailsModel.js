const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db.config').sequelize;

const UserDetails = sequelize.define('Userdetails', {
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

  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  address: {
    allowNull: true, 
    type: Sequelize.STRING
  },
  email: {
    allowNull: true, 
    type: Sequelize.STRING
  },
  personal_mobile: {
    allowNull: true,
    type: Sequelize.STRING
  },
  emergency_mobile: {
    allowNull: true,
    type: Sequelize.STRING
  },
  personal_mobile_country_code: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
  emergency_mobile_country_code: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
  dob: {
    allowNull: true, 
    type: Sequelize.STRING
  },
  gender: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
  blood_type: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
  id_proof: {
    allowNull: true, 
    type: Sequelize.STRING,
  },
  marital_status: {
    allowNull: true, 
    type: Sequelize.STRING
  },
  language: {
    allowNull: false, 
    type: Sequelize.STRING(8),
    defaultValue:"en"
  },
},
  {
    // Define additional options for the model
    tableName: 'userdetails', // Specify the table name
    // timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: true, // Enable soft deletion (deletedAt)
    // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
    underscored: true // Use underscored naming convention for columns
  });


module.exports = UserDetails;
