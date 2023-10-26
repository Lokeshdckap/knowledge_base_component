'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      user_uuid: {
        type: Sequelize.UUID, // This is the foreign key column
        references: {
          model: 'users', // This references the 'users' table
          key: 'uuid',     // This references the 'uuid' column in the 'users' table
        },
      },
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        unique:true,
        primaryKey: true,
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
    await queryInterface.dropTable('teams');
  }
};