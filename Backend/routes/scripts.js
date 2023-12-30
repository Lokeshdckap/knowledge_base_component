const express = require("express");

const router = express.Router();

require("dotenv").config();

const multer = require('multer');

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
const upload = multer({storage});

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const scriptController = require("../controllers/DashboardControllers/scriptsController");

router.post(
  "/addNewScript",
  verifyAuthMiddleware.verifyToken,
  scriptController.addNewScripts
);

router.get(
  "/getScript/:uuid",
  verifyAuthMiddleware.verifyToken,
  scriptController.getScript
);

router.post(
  "/addScriptTitle",
  verifyAuthMiddleware.verifyToken,
  scriptController.addScriptTitle
);
router.put(
  "/scriptLogo",
  verifyAuthMiddleware.verifyToken,
  upload.single('image'),
  scriptController.scriptLogo
);

module.exports = router;
