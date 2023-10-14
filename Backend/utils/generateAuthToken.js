const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {

  const payload = { id: user.id };

  let token = jwt.sign(payload, process.env.secretKey, {
    expiresIn: 1 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateAuthToken;
