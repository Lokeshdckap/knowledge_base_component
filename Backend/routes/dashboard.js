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
  "/addChildPage/:script_uuid/:uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.addChildPage
);

router.post(
  "/addPageData/:script_uuid",
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

router.get('/documents/:slug',
dashboardController.newDocuments
);

router.get('/scripts/:slug/:checked',
dashboardController.publicUrls
);

router.get('/pages/:slug/*',
dashboardController.particularPageRender
);


router.post('/updateTeamName',
verifyAuthMiddleware.verifyToken,
dashboardController.teamNameUpdate
);

router.get('/getAciveUsers/:uuid',
verifyAuthMiddleware.verifyToken,
dashboardController.getActiveUsersForTeam
);

router.post('/inviteUsers',
verifyAuthMiddleware.verifyToken,
dashboardController.inviteTeams
);


module.exports = router;
