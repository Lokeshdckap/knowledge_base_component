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


const verifyAuthMiddleware = require("../middleware/authenticationToken");

const userController = require("../controllers/FeatureControllers/userInfoController");

router.get(
  "/getUserInfo",
  verifyAuthMiddleware.verifyToken,
  userController.getUserInfo
);

router.put(
  "/userUpdateProfile",
  upload.single('image'),
  verifyAuthMiddleware.verifyToken,
  userController.userUpdateProfile
);
module.exports = router;
