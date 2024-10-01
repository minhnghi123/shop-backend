const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/admin/role.controller");
//middleware and using controller to reduce codes and make clean
router.get("/", roleController.index);

module.exports = router;
