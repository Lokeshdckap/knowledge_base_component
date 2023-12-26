'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      uuid: {
        allowNull:false,
        type: Sequelize.UUID,
        unique:true,    
      },
      title: {
        type: Sequelize.STRING,
        defaultValue:"New Folder"
      },
      description: {
        type: Sequelize.STRING,
        defaultValue: "Folder Description"
      },
      team_uuid: {
        type: Sequelize.UUID,
        references: {
          model: 'teams', // This references the 'teams' table
          key: 'uuid',     // This references the 'uuid' column in the 'teams' table
        },
      },
      deleted_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('batches');
  }
};