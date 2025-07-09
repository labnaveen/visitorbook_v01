const { DataTypes, Sequelize } = require("sequelize");
const Companies = require("./companiesModel");
const Roles = require("./rolesModel");
const Departments = require("./departmentsModel");
const sequelize = require("../config/db.config").sequelize;

const Employees = sequelize.define(
    "Employees",
    {
        // Define the model attributes (columns)
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(),
        },

        company_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },

        role_id: {
            type: DataTypes.TINYINT,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
        },

        firstname: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        middlename: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        lastname: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        phone_prefix: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        phone: {
            type: DataTypes.STRING(),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(),
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

        department_id: {
            type: DataTypes.TINYINT,
            allowNull: false,
            references: {
                model: "departments",
                key: "id",
            },
        },

        picture: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        language_id: {
            allowNull: false,
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        is_check_in_login: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
    },
    {
        // Define additional options for the model
        tableName: "employees", // Specify the table name
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        paranoid: false, // Enable soft deletion (deletedAt)
        deletedAt: "deleted_at", // If you want to give a custom name to the deletedAt column
        createdAt: "created_at", // If you want to give a custom name to the createdAt column
        updatedAt: "updated_at", // If you want to give a custom name to the updatedAt column
        underscored: true, // Use underscored naming convention for columns
    }
);

Companies.hasMany(Employees, { foreignKey: "company_id" });
Employees.belongsTo(Companies, { foreignKey: "company_id" });
Roles.hasMany(Employees, { foreignKey: "role_id" });
Employees.belongsTo(Roles, { foreignKey: "role_id" });
Departments.hasMany(Employees, { foreignKey: "department_id" });
Employees.belongsTo(Departments, { foreignKey: "department_id" });

module.exports = Employees;
