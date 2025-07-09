const { allow } = require("joi");
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const RazorPayCreditCardDetails = sequelize.define(
    "RazorPayCreditCardDetails",
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
        card_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        card_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        card_network: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        card_color: {
            type: Sequelize.STRING,
            allowNull: false,
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
        tableName: "razorpay_card_details", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = RazorPayCreditCardDetails;
