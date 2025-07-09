const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const UserSubscription = sequelize.define(
    "UserSubscription",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        company_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: "companies",
                key: "id",
            },
        },
        package_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: "package",
                key: "id",
            },
        },
        package_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        package_price: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        validity_in_days: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        start_date: {
            type: Sequelize.DATE, // Change to your desired type
            allowNull: true,
        },
        end_date: {
            type: Sequelize.DATE, // Change to your desired type
            allowNull: true,
        },
        created_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        is_package_enabled: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
        next_payment_date: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        stripe_subsciption_id: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        payment_method_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "user_subscription", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = UserSubscription;
