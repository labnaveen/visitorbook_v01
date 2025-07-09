const { Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;
const ContactUs = sequelize.define(
    "ContactUs",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },

        name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        contact_number: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        message: {
            allowNull: true,
            type: Sequelize.STRING,
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
    },
    {
        tableName: "contact_us", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

module.exports = ContactUs;
