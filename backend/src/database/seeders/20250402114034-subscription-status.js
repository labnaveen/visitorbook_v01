"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const isExists = await queryInterface.rawSelect("subscription_status", {}, ["id"]);
        if (!isExists) {
            return await queryInterface.bulkInsert("subscription_status", [
                {
                    id: 1,
                    subscription_status: "authenticated",
                },
                {
                    id: 2,
                    subscription_status: "activated",
                },
                {
                    id: 3,
                    subscription_status: "charged",
                },
                {
                    id: 4,
                    subscription_status: "pending",
                },
            ]);
        } else {
            console.log("Data already exists, skipping seed.");
            return Promise.resolve();
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("subscription_status", null, {});
    },
};
