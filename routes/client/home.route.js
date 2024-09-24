const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/client/home.controller");
//middleware and using controller to reduce codes and make clean
router.get("/", homeController.home);

module.exports = router;
