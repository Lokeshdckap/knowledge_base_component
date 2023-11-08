'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_team_members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID
      },
      user_uuid: {
        type: Sequelize.UUID,
        references: {         
          model: 'users',
          key: 'uuid'
        }
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {         
          model: 'roles_types',
          key: 'id'
        }
      },
      team_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'teams', // This references the 'teams' table
          key: 'uuid',     // This references the 'uuid' column in the 'teams' table
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
    await queryInterface.dropTable('user_team_members');
  }
};

