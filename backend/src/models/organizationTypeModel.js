const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const OrganizationType = sequelize.define(
    "OrganizationType",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        organization_type: {
            allowNull: true,
            type: Sequelize.STRING,
        },
    },
    {
        // Define additional options for the model
        tableName: "organization_type", // Specify the table name
        // timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: true, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = OrganizationType;
