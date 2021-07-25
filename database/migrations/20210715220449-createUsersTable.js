"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(512),
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        plan: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        },
      },
      {
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );

    // Add index BTREE to E-mail field
    await queryInterface.addIndex("users", ["email"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
