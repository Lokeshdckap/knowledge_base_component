const express = require("express");

const router = express.Router();

require("dotenv").config();

const publicController = require("../controllers/FeatureControllers/publicUrlController");

router.get("/documents/:uuid/:slug/*", publicController.newDocuments);

router.get("/scripts/:slug/:checked", publicController.publicUrls);

router.get("/pages/:slug/*", publicController.particularPageRender);

module.exports = router;
