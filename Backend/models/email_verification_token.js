"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class email_verification_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_verification_token.init(
    {
      user_uuid: DataTypes.UUID,
      token: DataTypes.STRING,
      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "email_verification_token",
    }
  );
  return email_verification_token;
};
