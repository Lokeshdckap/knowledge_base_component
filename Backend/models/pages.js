"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pages.init(
    {
      uuid: DataTypes.UUID,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT,
      script_uuid: DataTypes.UUID,
      page_uuid: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "pages",
    }
  );
  return pages;
};
