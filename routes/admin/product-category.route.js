const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middleware/admin/addCloud.middleware");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadCloudSingle,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadCloudSingle,
  controller.editPatch
);
module.exports = router;
