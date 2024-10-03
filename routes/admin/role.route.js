const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/admin/role.controller");
const roleValidate = require("../../validate/admin/role.validate");
//middleware and using controller to reduce codes and make clean
router.get("/", roleController.index);
router.get("/create", roleController.create);
router.get("/edit/:id", roleController.edit);
router.patch("/edit/:id", roleValidate.createPost, roleController.editPatch);
router.post("/create", roleValidate.createPost, roleController.createPost);
router.get("/permissions", roleController.permissions);
router.patch("/permissions", roleController.permissionsPatch);
module.exports = router;
