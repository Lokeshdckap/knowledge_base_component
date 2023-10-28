"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: "Page Name",
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: "Page Description",
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
      },
      page_uuid: {
        type: Sequelize.UUID,
        unique:true,
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
    await queryInterface.dropTable("pages");
  },
};
