const video = require("./video");

const express = require("express");

const router = express.Router();

// Use the routes
router.use("/video", video);

module.exports = router;
