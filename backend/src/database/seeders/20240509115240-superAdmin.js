"use strict";
const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface, Sequelize) {
        const isExists = await queryInterface.rawSelect("employees", { where: { role_id: 1 } }, ["id"]);
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        if (!isExists) {
            return await queryInterface.bulkInsert("employees", [
                {
                    company_id: 0,
                    role_id: 1,
                    firstname: "Super",
                    middlename: "",
                    lastname: "Admin",
                    phone_prefix: "+91",
                    phone: "6393195553",
                    email: "superadmin@glocalview.com",
                    password: hashedPassword,
                    picture: "",
                    department_id: 1,
                },
            ]);
        } else {
            console.log("Data already exist, skipping seed.");
            return Promise.resolve();
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("employees", null, {});
    },
};
