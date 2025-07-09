const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;
const Employees = require("../models/employeeModel")

const Visitors = sequelize.define(
  "Visitors",
  {
    // Define the model attributes (columns)

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      // type: Sequelize.UUID,
      type: DataTypes.INTEGER(),
    },

    company_id: {
      allowNull: false,
      type: DataTypes.INTEGER(),
    },

    name: {
      type: DataTypes.STRING(),
      allowNull: false,
    },

    employee_id: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      references: {
        model: 'employees', // Reference to the table name
        key: 'id',
      },
    },

    image: {
      allowNull: false,
      type: DataTypes.STRING(),
    },

    phone_prefix: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    company: {
      allowNull: true,
      type: Sequelize.STRING(),
    },
    status: {
      type: DataTypes.TINYINT(),
      allowNull: true,
    },
    vehicle_registration_number: {
      type: DataTypes.STRING(),
      allowNull: false
    },

    is_visitor_details_saved: {
      allowNull: true,
      type: DataTypes.TINYINT(),
      defaultValue: 0,
    },
    is_wifi_access_provided: {
      allowNull: true,
      type: DataTypes.TINYINT(),
      defaultValue: 0,
    },
    is_car_parked: {
      allowNull: true,
      type: DataTypes.TINYINT(),
      defaultValue: 0,
    },
    id_proof1: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    id_proof2: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
  },
  {
    // Define additional options for the model
    tableName: "visitors", // Specify the table name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    paranoid: false, // Enable soft deletion (deletedAt)
    deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
    createdAt: "created_at", // If you want to give a custom name to the createdAt column
    updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
    underscored: true, // Use underscored naming convention for columns
  }
);
Visitors.belongsTo(Employees, { foreignKey: 'employee_id' });
Employees.hasMany(Visitors, { foreignKey: 'employee_id' });

module.exports = Visitors;
