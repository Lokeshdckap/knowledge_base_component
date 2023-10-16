"use strict";
// const password_reset_token = require('../models/password_reset_token')
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // users.hasMany(password_reset_token,{
      //   foreignKey: 'user_uuid', // The name of the foreign key in the PasswordResetToken model
      //   as: 'passwordResetTokens', // Alias for the association
      // });
    }
  }
  users.init(
    {
      uuid: DataTypes.UUID,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      google_id: DataTypes.STRING,
      avatar: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      isAdmin: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
