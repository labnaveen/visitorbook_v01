const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const PaymentStatus = sequelize.define(
    "payment_status",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        payment_status: {
            allowNull: false,
            type: Sequelize.STRING,
        },
    },
    {
        // Define additional options for the model
        tableName: "payment_status", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = PaymentStatus;
