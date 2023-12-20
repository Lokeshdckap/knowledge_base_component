const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const inviteController = require("../controllers/FeatureControllers/inviteController");

router.post(
  "/inviteUsers",
  verifyAuthMiddleware.verifyToken,
  inviteController.inviteTeams
);

router.post(
  "/updateInvite",
  inviteController.updateInvite
);

router.post(
  "/updateRole",
  verifyAuthMiddleware.verifyToken,
  inviteController.updateRole
);

router.get(
  "/pendingList/:uuid",
  verifyAuthMiddleware.verifyToken,
  inviteController.pendingList
);

module.exports = router;
