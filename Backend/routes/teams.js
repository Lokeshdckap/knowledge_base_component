const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const teamController = require("../controllers/FeatureControllers/teamController");

router.post(
  "/team",
  verifyAuthMiddleware.verifyToken,
  teamController.createTeams
);

router.get(
  "/getTeam/:uuid",
  verifyAuthMiddleware.verifyToken,
  teamController.getTeam
);

router.post('/updateTeamName',
verifyAuthMiddleware.verifyToken,
teamController.teamNameUpdate
);

router.get('/getAciveUsers/:uuid',
verifyAuthMiddleware.verifyToken,
teamController.getActiveUsersForTeam
);

router.get(
  "/switchTeam/:uuid",
  verifyAuthMiddleware.verifyToken,
  teamController.switchTeam
);

router.get(
  "/getAllTeam",
  verifyAuthMiddleware.verifyToken,
  teamController.getAllTeam
);
module.exports = router;