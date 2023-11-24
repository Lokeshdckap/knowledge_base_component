const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const trashController = require("../controllers/FeatureControllers/trashController");

router.get(
  "/getAllTrash/:uuid",
  verifyAuthMiddleware.verifyToken,
  trashController.getAllTrash
);

router.put(
  "/moveToTrash/:uuid/:batchOrScriptuuid",
  verifyAuthMiddleware.verifyToken,
  trashController.moveToTrash
);

router.put(
  "/restore/:uuid/:batchOrScriptuuid",
  verifyAuthMiddleware.verifyToken,
  trashController.restoreParticular
);

router.delete(
  "/permanentDelete/:uuid/:batchOrScriptuuid",
  verifyAuthMiddleware.verifyToken,
  trashController.permanentDeleteParticular
);

router.delete(
  "/permanentDeleteAll/:uuid",
  verifyAuthMiddleware.verifyToken,
  trashController.permanentDeleteAll
);

router.delete(
  "/selectedTrash/:uuid",
  verifyAuthMiddleware.verifyToken,
  trashController.selectedTrash
);

module.exports = router;
