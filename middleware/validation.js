const Joi = require("joi");

const validateUser = async (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userName: Joi.string().required(),
  });

  try {
    await schema.validateAsync(user);
  } catch (error) {
    return error.details[0].message;
  }
};

const validateLogin = async (credentials) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    await schema.validateAsync(credentials);
  } catch (error) {
    return error.details[0].message;
  }
};

const validateEmail = async (email) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  try {
    await schema.validateAsync(email);
  } catch (error) {
    return error.details[0].message;
  }
};

const validateResetPasswordCredentials = async (
  email,
  verificationToken,
  password
) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    verificationToken: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    await schema.validateAsync({ email, verificationToken, password });
  } catch (error) {
    return error.details[0].message;
  }
};

module.exports = {
  validateUser,
  validateLogin,
  validateEmail,
  validateResetPasswordCredentials,
};
