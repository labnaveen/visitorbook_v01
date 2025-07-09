"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const isExists = await queryInterface.rawSelect("organization_type", {}, ["id"]);
        if (!isExists) {
            return await queryInterface.bulkInsert("organization_type", [
                { id: 1, organization_type: "Corporate & Business Offices" },
                { id: 2, organization_type: "Manufacturing & Industrial Facilities" },
                { id: 3, organization_type: "Educational Institutions" },
                { id: 4, organization_type: "Healthcare & Medical Facilities" },
                { id: 5, organization_type: "Government & Public Sector" },
                { id: 6, organization_type: "Hospitality & Real Estate" },
                { id: 7, organization_type: "Retail & Shopping Centers" },
                { id: 8, organization_type: "Event & Conference Venues" },
                { id: 9, organization_type: "Financial Institutions" },
                { id: 10, organization_type: "Security & Defense Organizations" },
                { id: 11, organization_type: "Religious & Cultural Institutions" },
                { id: 12, organization_type: "Media & Entertainment" },
                { id: 13, organization_type: "Legal & Consulting Firms" },
                { id: 14, organization_type: "Research & Development Centers" },
                { id: 15, organization_type: "Construction & Real Estate Firms" },
                { id: 16, organization_type: "Airlines & Transportation Hubs" },
                { id: 17, organization_type: "Fitness & Wellness Centers" },
                { id: 18, organization_type: "Agriculture & Food Processing Units" },
                { id: 19, organization_type: "Non-Governmental Organizations (NGOs) & Social Service Centers" },
                { id: 20, organization_type: "Gaming & eSports Arenas" },
                { id: 21, organization_type: "Automobile & Manufacturing Plants" },
                { id: 22, organization_type: "Telecom & Data Centers" },
                { id: 23, organization_type: "Luxury & High-Security Facilities" },
                { id: 24, organization_type: "Advertising & Marketing Agencies" },
                { id: 25, organization_type: "Others" },
            ]);
        } else {
            console.log("Data already exists, skipping seed.");
            return Promise.resolve();
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("organization_type", null, {});
    },
};
