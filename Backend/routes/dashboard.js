const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware  = require("../middleware/authenticationToken");


const dashboardController = require("../controllers/Dashboard/dashboard");


router.post("/team",verifyAuthMiddleware.verifyToken,dashboardController.createTeams);



module.exports = router;

