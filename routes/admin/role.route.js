const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/admin/role.controller");
const roleValidate = require("../../validate/admin/role.validate");
//middleware and using controller to reduce codes and make clean
router.get("/", roleController.index);
router.get("/create", roleController.create);
router.post("/create", roleValidate.createPost, roleController.createPost);
module.exports = router;
