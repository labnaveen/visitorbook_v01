const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config").sequelize;
const AppSettings = require("./appSettingsModel");
const CompanySignUpDetails = require("./company_sign_up_details");
const Companies = sequelize.define(
    "Companies",
    {
        // Define the model attributes (columns)

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(),
        },

        picture: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

        code: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        status: {
            type: DataTypes.TINYINT(),
            allowNull: false,
        },
        companies_sign_up_details_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "company_sign_up_details",
                key: "id",
            },
        },
        payment_status: {
            type: Sequelize.TINYINT(),
            allowNull: true,
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        duration: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        package_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
    {
        // Define additional options for the model
        tableName: "companies", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);
// Define associations here

Companies.hasMany(AppSettings, { foreignKey: "company_id" });
AppSettings.belongsTo(Companies, { foreignKey: "company_id" });

module.exports = Companies;
