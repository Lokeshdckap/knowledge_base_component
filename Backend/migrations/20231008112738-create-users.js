"use strict";
/** @type {import('sequelize-cli').Migration} */
const uuid = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        allowNull: false,
        unique:true,
        type: Sequelize.UUID,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_id:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      isVerified:{
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isAdmin:{
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("users");
  },
};
