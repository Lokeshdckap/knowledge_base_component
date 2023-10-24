'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        unique:true,
        field: 'uuid',
      },
      title: {
        type: Sequelize.STRING,
        defaultValue : "New Batch",
      },
      description: {
        type: Sequelize.STRING
      },
      team_uuid: {
        type: Sequelize.UUID,
        field: 'uuid',
        references: {         
          model: 'teams',
          key: 'uuid'
        }
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