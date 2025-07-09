"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const isExists = await queryInterface.rawSelect("payment_status", {}, ["id"]);
        if (!isExists) {
            return await queryInterface.bulkInsert("payment_status", [
                {
                    id: 1,
                    payment_status: "authorized",
                },
                {
                    id: 2,
                    payment_status: "captured",
                },
                {
                    id: 3,
                    payment_status: "failed",
                },
                {
                    id: 4,
                    payment_status: "pending",
                },
            ]);
        } else {
            console.log("Data already exists, skipping seed.");
            return Promise.resolve();
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("payment_status", null, {});
    },
};
