const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const dashboardController = require("../controllers/Dashboard/dashboard");

router.post(
  "/team",
  verifyAuthMiddleware.verifyToken,
  dashboardController.createTeams
);

router.get(
  "/getTeam/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getTeam
);

router.post(
  "/addNewBatch",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addNewBatch
);

router.get(
  "/getBatch/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getBatch
);

router.get(
  "/switchTeam/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.switchTeam
);

router.post(
  "/addNewScript",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addNewScripts
);

router.get(
  "/getScript/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getScript
);

router.get(
  "/getAllTeam",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getAllTeam
);

router.get(
  "/getBatchAndScripts/:team_uuid/:batch_uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getBatchAndScripts
);

router.get(
  "/getScriptAndPage/:script_uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getScriptAndPage
);

router.get(
  "/addScriptTitle",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addScriptTitle
);

router.get(
  "/addBatchTitleAndDescription",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addBatchTitleAndDescription
);

router.post(
  "/addPageData/:script_uuid/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addPageData
);

router.post(
  "/addPageData/:script_uuid/:page_uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addPageData
);

router.post(
  "/updatePageData",
  verifyAuthMiddleware.verifyToken,
  dashboardController.updatePageData
);

router.get(
  "/getPage/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getPage
);
module.exports = router;
