const Joi = require("joi");

const registrationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const passwordResetSchema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});

const createTeamSchema = Joi.object({
  team_name: Joi.string().required(),
});

module.exports = {
  registrationSchema,
  loginSchema,
  passwordResetSchema,
  createTeamSchema,
};
