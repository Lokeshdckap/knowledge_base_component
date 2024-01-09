'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class published_content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  published_content.init({
    uuid: DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.JSON,
    script_uuid: DataTypes.UUID,
    page_uuid: DataTypes.UUID,
    path: DataTypes.TEXT,
    emoji: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'published_content',
  });
  return published_content;
};