const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const batchController = require("../controllers/FeatureControllers/batchController");

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
