'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class images_path extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  images_path.init({
    uuid: DataTypes.UUID,
    page_uuid: DataTypes.UUID,
    filename: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'images_path',
  });
  return images_path;
};