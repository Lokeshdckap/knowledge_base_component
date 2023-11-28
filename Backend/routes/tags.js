const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const tagController = require("../controllers/FeatureControllers/tagsController");


router.get(
    "/getTags/:uuid",
    verifyAuthMiddleware.verifyToken,
    tagController.getTags
  );


module.exports = router;