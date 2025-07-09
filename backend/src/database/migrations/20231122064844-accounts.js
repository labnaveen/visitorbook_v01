"use strict";

/** @type {import('sequelize-cli').Migration} */

// migration-create-users.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("accounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(62),
      },
      mobile: {
        allowNull: true,
        type: Sequelize.STRING(11),
      },
      is_email_verify: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      is_mobile_verify: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      is_registered_from: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      country_code: {
        allowNull: true,
        type: Sequelize.STRING(4),
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING(8),
      },
      user_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      google_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fb_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      apple_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      signup_by: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      user_hash: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_first_password_changed: {
        allowNull: true,
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      is_blocked: {
        allowNull: false,
        type: Sequelize.STRING(10),
        defaultValue: 0,
      },

      allowed_logins_in_web: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      allowed_login_in_mobile: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      profile_image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("accounts");
  },
};
