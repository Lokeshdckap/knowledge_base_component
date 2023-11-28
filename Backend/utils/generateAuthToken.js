const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const payload = { id: user.uuid };

  const access_token = jwt.sign(payload, process.env.secretKey, {
    expiresIn: "24h",
  });

  return access_token;
};

const generateAuthRefreshToken = (user) => {
  const payload = { id: user.uuid };

  const refresh_token = jwt.sign(payload, process.env.secretKey, {
    expiresIn: "24h",
  });

  return refresh_token;
};

module.exports = {
  generateAuthToken,
  generateAuthRefreshToken,
};
