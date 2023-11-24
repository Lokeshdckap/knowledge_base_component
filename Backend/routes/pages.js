const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authenticationToken");

const pageController = require("../controllers/FeatureControllers/pagesController");

router.post(
  "/addChildPage/:script_uuid/:uuid",
  verifyAuthMiddleware.verifyToken,
  pageController.addChildPage
);

router.post(
  "/addPageData/:script_uuid",
  verifyAuthMiddleware.verifyToken,
  pageController.addPageData
);

router.post(
  "/updatePageData",
  verifyAuthMiddleware.verifyToken,
  pageController.updatePageData
);

router.get(
  "/getPage/:uuid",
  verifyAuthMiddleware.verifyToken,
  pageController.getPage
);



module.exports = router;
