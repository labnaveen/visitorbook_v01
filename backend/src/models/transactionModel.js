const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        package_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "package",
                key: "id",
            },
        },
        stripe_subscription_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        payment_status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 1,
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
        company_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        payment_method_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
    },
    {
        // Define additional options for the model
        tableName: "transaction", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        // deletedAt: 'deleted_at',  // If you want to give a custom name to the deletedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = Transaction;
