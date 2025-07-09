const { Sequelize, Transaction } = require("sequelize");
const PurchasedSubscriptionDetails = require("./PurchasedSubscriptionDetailsModel");
const UserSubscription = require("./userSubscriptionModel");
const sequelize = require("../config/db.config").sequelize;

const PurchasedSubscription = sequelize.define(
    "PurchasedSubscription",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        company_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "companies",
                key: "id",
            },
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
        is_PurchasedSubscription_enabled: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        tableName: "purchased_subscription",
        timestamps: true,
        paranoid: true,
        underscored: true,
        deletedAt: "deleted_at",
        createdAt: "created_at",
    }
);

module.exports = PurchasedSubscription;
