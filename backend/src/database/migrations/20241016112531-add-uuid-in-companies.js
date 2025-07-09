"use strict";

const { DataTypes } = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDescription = await queryInterface.describeTable("companies");

        if (!tableDescription.uuid) {
            await queryInterface.addColumn("companies", "uuid", {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            });
        } else {
            console.log("Column uuid in companies table already exists. Skipping migration....");
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("companies", "uuid");
    },
};
