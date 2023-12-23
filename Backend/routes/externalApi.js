const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyApiAuthMiddleware = require("../middleware/apiAuthMiddleware");

const externalApiContoller = require("../controllers/DashboardControllers/externalApiController");

router.get(
  "/getBatchAndScripts/:team_uuid",
  verifyApiAuthMiddleware.apiAuthMiddleware,
  externalApiContoller.getBatchAndScriptsApi
);

module.exports = router;
