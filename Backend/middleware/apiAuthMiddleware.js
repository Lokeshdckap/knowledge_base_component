const db = require("../utils/database");
const { verifyExternalJwt } = require("../utils/jwt");
const { Op, where } = require("sequelize");

const Access_Token = db.access_tokens;

const apiAuthMiddleware = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      msg: "Invaild Token or Missing the Token",
    });
  }

  const access_token = token.replace("Bearer ", "");

  const checkAccessToken = await Access_Token.findOne({
    where: {
      [Op.and]: [{ token: access_token }, { status: 1 }],
    },
  });

  if (!checkAccessToken) {
    return res.status(401).json({
      msg: "Invaild Token or Missing the Token",
    });
  }

  try {
    const decodeToken = verifyExternalJwt(access_token);

    if (decodeToken.err) {
      return res.status(401).json({
        err: decodeToken.err,
      });
    }
    req.team = decodeToken;

    next();
  } catch (err) {
    return res.status(401).json({
      err: "Unauthorized : Invaild Token",
    });
  }
};

module.exports = {
  apiAuthMiddleware,
};
