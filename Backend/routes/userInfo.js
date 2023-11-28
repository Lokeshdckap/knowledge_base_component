const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const userController = require("../controllers/FeatureControllers/userInfoController");

router.get(
  "/getUserInfo",
  verifyAuthMiddleware.verifyToken,
  userController.getUserInfo
);

router.put(
  "/userUpdateProfile",
  verifyAuthMiddleware.verifyToken,
  userController.userUpdateProfile
);
module.exports = router;
