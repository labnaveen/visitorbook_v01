const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;
const CreditCardDetails = sequelize.define(
    "CreditCardDetails",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "companies",
                key: "id",
            },
        },
        package_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        card_holder: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        expiry_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        payment_method_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        created_at: {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
            allowNull: true,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        card_number: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        card_type: {
            allowNull: true,
            type: Sequelize.STRING,
        },
    },
    {
        tableName: "credit_card_details", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);
// Define associations here

module.exports = CreditCardDetails;
