"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("published_contents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.JSON,
      },
      script_uuid: {
        type: Sequelize.UUID,
        references: {
          model: "scripts", // This references the 'script' table
          key: "uuid", // This references the 'uuid' column in the 'script' table
        },
        onDelete: "CASCADE", // This enables cascading delete
      },
      page_uuid: {
        type: Sequelize.UUID,
      },
      path: {
        type: Sequelize.TEXT,
      },
      emoji: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("published_contents");
  },
};
