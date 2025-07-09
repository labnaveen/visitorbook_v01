const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;

const SubscriptionType = sequelize.define(
    "SubscriptionType",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        type_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "subscription_type",
        timestamps: true,
        paranoid: true,
        underscored: true,
        deletedAt: "deleted_at",
        createdAt: "created_at",
    }
);

module.exports = SubscriptionType;
