const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/notification.controller");
router.get("/", controller.index);

module.exports = router;
