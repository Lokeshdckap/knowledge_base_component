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

module.exports = router;
