"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class teams extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      teams.hasMany(models.batch, { foreignKey: 'team_uuid' });
      teams.hasMany(models.script, { foreignKey: 'team_uuid' });

    }
  }
  teams.init(
    {
      user_uuid: DataTypes.UUID,
      name: DataTypes.STRING,
      uuid: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "teams",
    }
  );
  return teams;
};
