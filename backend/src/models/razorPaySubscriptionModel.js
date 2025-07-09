const { allow } = require("joi");
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const RazorPaySubscription = sequelize.define(
    "RazorPaySubscription",
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
        subscription_status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 4,
        },

        plan_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        customer_id: {
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

        package_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },

        company_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        package_name: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        package_price: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        validity_in_days: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        user_base: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        next_payment_date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        susbscription_type: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
    {
        // Define additional options for the model
        tableName: "razorpay_subscription", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = RazorPaySubscription;
