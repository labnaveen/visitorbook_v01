"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const isExists = await queryInterface.rawSelect("roles", {}, ["id"])
    if (!isExists) {
      return await queryInterface.bulkInsert("roles", [
        {
          id: 1,
          name: "superadmin",
          display_name: "Super Admin"
        },
        {
          id: 2,
          name: "admin",
          display_name: "Admin"
        },
        {
          id: 3,
          name: "employee",
          display_name: "Employee"
        },
      ]);
    } else {
      console.log("Data already exist, skipping seed.");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
