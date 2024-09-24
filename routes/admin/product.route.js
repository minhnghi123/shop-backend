const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const productController = require("../../controllers/admin/product.controller");
const productValidate = require("../../validate/admin/product.validate");
const uploadCloud = require("../../middleware/admin/addCloud.middleware");
router.get("/", productController.index);
router.patch("/status-change", productController.changeStatusByClick);
router.patch("/status-multi-changes", productController.changeMultiStatus);
router.patch("/delete-multi", productController.deleteMulti);
router.patch("/delete-per", productController.deletePer);
router.get("/rubbish-page", productController.rubbishPage);
router.patch("/restore-all", productController.restoreAll);
router.patch("/change-position", productController.changePosition);
router.delete("/delete", productController.deletePermanent);
router.get("/create", productController.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadCloudSingle,
  productValidate.createPost,
  productController.createPost
);

router.get("/edit/:id", productController.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadCloudSingle,
  productValidate.createPost,
  productController.editPatch
);

//

router.get("/detail/:id", productController.detail);

module.exports = router;
