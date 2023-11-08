'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      email: {
        type: Sequelize.STRING
      },
      is_progess: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      team_uuid: {
        type: Sequelize.UUID,
        references: {
          model: "teams", // This references the 'teams' table
          key: "uuid", // This references the 'uuid' column in the 'teams' table
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invites');
  }
};