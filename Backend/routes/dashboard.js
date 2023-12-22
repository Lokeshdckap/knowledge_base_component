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

// Controllers

const verifyAuthMiddleware = require("../middleware/authMiddleware");

const dashboardController = require("../controllers/DashboardControllers/dashboardController");


router.get(
  "/getBatchAndScripts/:team_uuid/:batch_uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getBatchAndScripts
);

router.get(
  "/getScriptAndPage/:script_uuid",
  verifyAuthMiddleware.verifyToken,
  dashboardController.getScriptAndPage
);

router.get('/getScripts/:uuid/:slug',
verifyAuthMiddleware.verifyToken,
dashboardController.getScripts
);


router.post('/uploadImage',
verifyAuthMiddleware.verifyToken,
upload.single('image'),
dashboardController.uploadImage,
);

router.get("/:uuid/search/items",
verifyAuthMiddleware.verifyToken,
dashboardController.globalSearch
)
router.get("/:uuid/:slug/pageSearch/items",
dashboardController.pageSearch
)

router.get("/getOpenParent/:uuid",
dashboardController.getParentPage
)
router.get("/pagination/:uuid",
dashboardController.paginationHandle
)

router.post("/createAccessToken",
dashboardController.createAccessToken
)

module.exports = router;
