const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
const uploadCloud = require("../../middleware/admin/addCloud.middleware");
const multer = require("multer");
const upload = multer();
router.get("/", accountController.index);
router.get("/create", accountController.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadCloudSingle,
  accountController.createPost
);
module.exports = router;
