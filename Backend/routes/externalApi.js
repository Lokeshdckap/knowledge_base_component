const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyApiAuthMiddleware = require("../middleware/apiAuthMiddleware");

const externalApiContoller = require("../controllers/DashboardControllers/externalApiController");

router.get(
  "/getBatch",
  verifyApiAuthMiddleware.apiAuthMiddleware,
  externalApiContoller.getBatchApi
);

router.get(
  "/getScript",
  verifyApiAuthMiddleware.apiAuthMiddleware,
  externalApiContoller.getScriptApi
);

router.get(
  "/getBatchAndScripts/:batch_uuid",
  verifyApiAuthMiddleware.apiAuthMiddleware,
  externalApiContoller.getBatchAndScriptsApi
);

router.get(
  "/getScriptAndPage/:script_uuid",
  verifyApiAuthMiddleware.apiAuthMiddleware,
  externalApiContoller.getScriptForPageApi
);

module.exports = router;
