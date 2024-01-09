const express = require("express");

const router = express.Router();

require("dotenv").config();

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const pageController = require("../controllers/DashboardControllers/pagesController");

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

router.delete(
  "/permanentDeletePage/:uuid",
  verifyAuthMiddleware.verifyToken,
  pageController.permanentDeletePage
);

router.put(
  "/mergeSourceDataToPublic",
  verifyAuthMiddleware.verifyToken,
  pageController.mergeSourceDataToPublic
);



module.exports = router;
