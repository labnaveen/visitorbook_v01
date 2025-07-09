const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const StripePackage = sequelize.define(
    "StripePackage",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        stripe_package_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        stripe_package_price: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        stripe_product_id: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        stripe_price_id: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        validity_in_days: {
            allowNull: false,
            type: Sequelize.INTEGER,
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
        is_stripe_package_enabled: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
        user_base: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "stripe_package",
        timestamps: true,
        paranoid: true,
        underscored: true,
        deletedAt: "deleted_at",
        createdAt: "created_at",
    }
);

module.exports = StripePackage;
