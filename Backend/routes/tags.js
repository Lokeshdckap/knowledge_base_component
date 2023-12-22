const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const tagController = require("../controllers/DashboardControllers/tagsController");


router.get(
    "/getTags/:uuid",
    verifyAuthMiddleware.verifyToken,
    tagController.getTags
  );


module.exports = router;