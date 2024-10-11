const express = require("express");
const router = express.Router();
const productController = require("../../controllers/client/product.controller");
router.get("/", productController.home);
router.get("/edit", productController.edit);
router.get("/delete", productController.dele);
router.get("/search", productController.search);
router.get("/detail/:slugProduct", productController.detail);
router.get("/:slugCategory", productController.category);

module.exports = router;
