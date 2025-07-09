const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const ApprovedStatus = sequelize.define(
    "ApprovedStatus",
    {
        // Define the model attributes (columns)

        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        status_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        // Define additional options for the model
        tableName: "approved_status", // Specify the table name
        timestamps: false, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = ApprovedStatus;
