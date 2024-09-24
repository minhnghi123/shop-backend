const express = require("express");
const multer = require("multer");
const productValidate = require("../../validate/admin/product.validate");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
const productController = require("../../controllers/admin/product.controller");
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
  productValidate.createPost,
  productController.createPost
);

router.get("/edit/:id", productController.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  productValidate.createPost,
  productController.editPatch
);

//

router.get("/detail/:id", productController.detail);

module.exports = router;
