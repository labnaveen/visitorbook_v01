"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const isExists = await queryInterface.rawSelect("languages", {}, ["id"])
    if (!isExists) {
      return await queryInterface.bulkInsert("languages", [
        {
          id: 1,
          language: "English",
          code: "en"

        },
        {
          id: 2,
          language: "Hindi",
          code: "hi"
        },
        {
          id: 3,
          language: "Norwegian",
          code: "no"
        },
      ]);
    } else {
      console.log("Data already exist, skipping seed.");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("languages", null, {});
  },
};
