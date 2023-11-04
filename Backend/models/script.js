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
      
      script.belongsTo(models.batch, {foreignKey: 'batch_uuid'});
      script.belongsTo(models.teams, {foreignKey: 'team_uuid'});

      // define association here
    }
  }
  script.init({
    uuid: DataTypes.UUID,
    title: DataTypes.STRING,
    team_uuid: DataTypes.UUID,
    batch_uuid: DataTypes.UUID,
    deleted_at: DataTypes.DATE,
    is_published:DataTypes.INTEGER,
    path:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'script',
  });
  return script;
};