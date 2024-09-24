const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboard.controller");
//middleware and using controller to reduce codes and make clean
router.get("/", dashboardController.index);

module.exports = router;
