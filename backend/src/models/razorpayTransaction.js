const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const RazorpayTransaction = sequelize.define(
    "RazorpayTransaction",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },

        subscription_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        plan_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        customer_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        payment_method: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        order_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        transaction_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        payment_status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 4,
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
        tableName: "razorpay_transaction", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = RazorpayTransaction;
