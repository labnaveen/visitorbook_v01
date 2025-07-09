"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if any data already exists in the 'subscription_type' table
        const isExists = await queryInterface.rawSelect("subscription_type", {}, ["id"]);

        // If no data exists, insert seed data
        if (!isExists) {
            return await queryInterface.bulkInsert("subscription_type", [
                {
                    id: 1,
                    type: 1, // For Manual type
                    type_name: "Manual",
                },
                {
                    id: 2,
                    type: 2, // For Online type
                    type_name: "Online",
                },
                {
                    id: 3,
                    type: 3, // For Razorpay type
                    type_name: "Razorpay",
                },
                {
                    id: 4,
                    type: 4, // For Stripe type
                    type_name: "Stripe",
                },
            ]);
        } else {
            console.log("Data already exists, skipping seed.");
            return Promise.resolve();
        }
    },

    async down(queryInterface, Sequelize) {
        // Remove all entries from the 'subscription_type' table
        await queryInterface.bulkDelete("subscription_type", null, {});
    },
};
