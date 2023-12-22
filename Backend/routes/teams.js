const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const teamController = require("../controllers/DashboardControllers/teamController");

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

router.post(
  "/updateTeamName",
  verifyAuthMiddleware.verifyToken,
  teamController.teamNameUpdate
);

router.get(
  "/getAciveUsers/:uuid",
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

router.get(
  "/:uuid/search/users",
  verifyAuthMiddleware.verifyToken,
  teamController.searchActiveUsers
);

router.delete("/removeUserFromTeam",
verifyAuthMiddleware.verifyToken,
teamController.activeUserRemove)

module.exports = router;