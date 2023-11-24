const express = require("express");

const router = express.Router();

require("dotenv").config();

const path = require("path");

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const trashController = require("../controllers/FeatureControllers/trashController");

router.get("/getAllTrash/:uuid",
verifyAuthMiddleware.verifyToken,
trashController.getAllTrash
)

router.put("/moveToTrash/:uuid/:batchOrScriptuuid",
verifyAuthMiddleware.verifyToken,
trashController.moveToTrash
)

module.exports = router;