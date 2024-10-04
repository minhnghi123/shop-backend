const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
const uploadCloud = require("../../middleware/admin/addCloud.middleware");
const multer = require("multer");
const upload = multer();
router.get("/", accountController.index);
router.get("/create", accountController.create);
router.get("/edit/:id", accountController.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.uploadCloudSingle,
  accountController.editPatch
);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadCloudSingle,
  accountController.createPost
);
module.exports = router;
