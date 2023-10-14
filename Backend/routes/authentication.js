const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth");

require("dotenv").config();

const passport = require("passport");

const authController = require("../controllers/Authentication/authentication");

const forgotPassword = require('../controllers/Authentication/passwordReset')

router.post("/register", authMiddleware.saveUser,authController.register);

router.post("/login", authController.login);

router.post('/forgotPassword',forgotPassword.forgotPassword);

router.post('/resetPassword/:uuid/:token',forgotPassword.resetPassword);


router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Redirect or send a response after successful Google OAuth login
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get('/verify-email/:uuid/:token', authController.verifyEmail)

// router.route('/:id')
//     .get(employeeController.getEmployee)
module.exports = router;
