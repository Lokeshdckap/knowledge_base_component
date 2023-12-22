const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const batchController = require("../controllers/DashboardControllers/batchController");

router.post(
  "/addNewBatch",
  verifyAuthMiddleware.verifyToken,
  batchController.addNewBatch
);

router.get(
  "/getBatch/:uuid",
  verifyAuthMiddleware.verifyToken,
  batchController.getBatch
);
router.post(
  "/addBatchTitleAndDescription",
  verifyAuthMiddleware.verifyToken,
  batchController.addBatchTitleAndDescription
);

module.exports = router;
