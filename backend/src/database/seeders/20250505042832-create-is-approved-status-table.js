"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "approved_status",
            [
                { id: 0, status_name: "Pending" },
                { id: 1, status_name: "Approved" },
                { id: 2, status_name: "Declined" },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("approved_status", null, {});
    },
};
