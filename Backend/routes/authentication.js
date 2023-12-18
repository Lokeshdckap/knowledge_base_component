const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const generateAuthToken = require("../utils/generateAuthToken");

const {
  verifyToken,
  refreshToken,
} = require("../middleware/authenticationToken");

require("dotenv").config();

const passport = require("passport");

const authController = require("../controllers/Authentication/authentication");

const forgotPassword = require("../controllers/Authentication/passwordReset");

router.post("/register", authMiddleware.saveUser, authController.register);

router.post("/login", authController.login);

router.post("/forgotPassword", forgotPassword.forgotPassword);

router.post("/resetPassword/:uuid/:token", forgotPassword.resetPassword);

router.get("/verify-email/:uuid/:token", authController.verifyEmail);

router.post("/resendVerifyEmail", authController.resendEmailLink);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    console.log(user, "users");
    if (err) {
      return res
        .status(500)
        .json({ Error: "This email is already registered. Please sign in" });
    }
    if (!user) {
      return res
        .status(409)
        .json({
          Error: "User Already Exists & Failed To Authentication to Google",
        });
    }
    const access_token = generateAuthToken.generateAuthToken(user);
    
    const refresh_token = generateAuthToken.generateAuthRefreshToken(user);
    res
      .status(200)
      .json({ access_token: access_token,refresh_token:refresh_token,verify: user.isVerified });
  })(req, res, next);
});




router.post("/refresh-token", refreshToken);

module.exports = router;
