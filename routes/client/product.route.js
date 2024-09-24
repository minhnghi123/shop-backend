const express = require("express");
const router = express.Router();
const productController = require("../../controllers/client/product.controller");
router.get("/", productController.home);
router.get("/edit", productController.edit);
router.get("/delete", productController.dele);

module.exports = router;
