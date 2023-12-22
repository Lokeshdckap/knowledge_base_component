const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const scriptController = require("../controllers/DashboardControllers/scriptsController");

router.post(
  "/addNewScript",
  verifyAuthMiddleware.verifyToken,
  scriptController.addNewScripts
);

router.get(
  "/getScript/:uuid",
  verifyAuthMiddleware.verifyToken,
  scriptController.getScript
);

router.post(
  "/addScriptTitle",
  verifyAuthMiddleware.verifyToken,
  scriptController.addScriptTitle
);

module.exports = router;
