'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invites.init({
    uuid: DataTypes.UUID,
    email: DataTypes.STRING,
    is_progress: DataTypes.INTEGER,
    team_uuid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'invites',
  });
  return invites;
};