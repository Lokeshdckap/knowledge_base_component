"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      batch.hasMany(models.script, { foreignKey: "batch_uuid" });
      batch.belongsTo(models.teams, { foreignKey: "team_uuid" });
    }
  }
  batch.init(
    {
      uuid: DataTypes.UUID,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      team_uuid: DataTypes.UUID,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "batch",
    }
  );
  return batch;
};
