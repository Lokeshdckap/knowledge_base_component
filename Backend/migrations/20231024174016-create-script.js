"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("scripts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        
      },
      title: {
        type: Sequelize.STRING,
        defaultValue:"Untitled Content"
      },
      team_uuid: {
        type: Sequelize.UUID,
        references: {
          model: "teams", // This references the 'teams' table
          key: "uuid", // This references the 'uuid' column in the 'teams' table
        },
      },
      batch_uuid: {
        type: Sequelize.UUID,
        references: {
          model: "batches", // This references the 'batch' table
          key: "uuid", // This references the 'uuid' column in the 'batch' table
        },
      },
      deleted_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("scripts");
  },
};
