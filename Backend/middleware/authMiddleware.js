const jwt = require("jsonwebtoken");

const config = process.env;

const tokens = require("../utils/generateAuthToken");

const generateAuthToken = tokens.generateAuthToken;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  const tokenWithoutBearer = token.replace("Bearer ", "");

  if (!tokenWithoutBearer) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(tokenWithoutBearer, config.secretKey);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Unauthorization Token");
  }
  return next();
};



const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, config.secretKey, async (err, user) => {
    if (err) return res.status(401).send("Unauthorization Token");

    let access_token = generateAuthToken(user);

    return res.status(200).json({ access_token: access_token });
  });
};

module.exports = {
  verifyToken,
  refreshToken,
};
