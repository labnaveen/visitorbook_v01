const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const SubscriptionStatus = sequelize.define(
    "SubscriptionStatus",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        subscription_status: {
            allowNull: false,
            type: Sequelize.STRING,
        },
    },
    {
        // Define additional options for the model
        tableName: "subscription_status", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = SubscriptionStatus;
