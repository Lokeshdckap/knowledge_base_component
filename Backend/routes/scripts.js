const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const scriptController = require("../controllers/FeatureControllers/scriptsController");

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
