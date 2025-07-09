const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config').sequelize

const PasswordRecovery = sequelize.define(
    'password_recovery',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'employees', // Replace with your user table name
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        otp: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        sent_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        expired_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        is_used: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        // Additional columns as per your requirements
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
        // Define additional options for the model
        tableName: 'password_recovery', // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        underscored: true, // Use underscored naming convention for columns
    },
)

module.exports = PasswordRecovery
