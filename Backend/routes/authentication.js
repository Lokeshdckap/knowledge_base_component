const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const generateAuthToken = require("../utils/generateAuthToken");

require("dotenv").config();

const passport = require("passport");

const authController = require("../controllers/Authentication/authentication");

const forgotPassword = require("../controllers/Authentication/passwordReset");

const { google } = require("../controllers/Authentication/googleLogin");
google();

router.post("/register", authMiddleware.saveUser, authController.register);

router.post("/login", authController.login);

router.post("/forgotPassword", forgotPassword.forgotPassword);

router.post("/resetPassword/:uuid/:token", forgotPassword.resetPassword);

router.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect:"http://localhost:3000/dashboard",
		failureRedirect: "http://localhost:3000/signin",
	}),
  (req, res) => {
    console.log(res,"llll");
    const token = generateAuthToken.generateAuthToken(req.user);
    return res.send(200).json({acces_token:token});
  }
);

router.get("/verify-email/:uuid/:token", authController.verifyEmail);

router.post("/resendVerifyEmail", authController.resendEmailLink);

module.exports = router;
