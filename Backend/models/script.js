'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class script extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  script.init({
    uuid: DataTypes.UUID,
    title: DataTypes.STRING,
    batch_uuid: DataTypes.UUID,
    team_uuid: DataTypes.UUID,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'script',
  });
  return script;
};