const { Sequelize, Transaction } = require("sequelize");
const PackageDetails = require("./packageDetailsModel");
const UserSubscription = require("./userSubscriptionModel");
const sequelize = require("../config/db.config").sequelize;

const Package = sequelize.define(
    "Package",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
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
        user_base: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "package",
        timestamps: true,
        paranoid: true,
        underscored: true,
        deletedAt: "deleted_at",
        createdAt: "created_at",
    }
);
Package.hasOne(PackageDetails, { foreignKey: "package_id" });
PackageDetails.belongsTo(Package, { foreignKey: "package_id" });

Package.hasOne(UserSubscription, { foreignKey: "package_id" });
UserSubscription.belongsTo(Package, { foreignKey: "package_id" });

// Package.hasOne(Transaction, { foreignKey: "package_id" });
// Transaction.belongsTo(Package, { foreignKey: "package_id" });

module.exports = Package;
