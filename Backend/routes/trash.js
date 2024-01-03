const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const trashController = require("../controllers/DashboardControllers/trashController");

router.get(
  "/getAllTrash/:uuid",
  verifyAuthMiddleware.verifyToken,
  trashController.getAllTrash
);

router.get("/getAllTrashScriptsForBatch/team_uuid/batch_uuid",
verifyAuthMiddleware.verifyToken,
trashController.getAllTrashScriptsForBatch
)

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

router.get("/getAllTrashScriptsForBatch/:team_uuid/:batch_uuid",
verifyAuthMiddleware.verifyToken,
trashController.getAllTrashScriptsForBatch
)

module.exports = router;
