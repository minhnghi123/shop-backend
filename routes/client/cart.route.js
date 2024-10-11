const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");
router.get("/", controller.index);
router.get("/delete/:id", controller.delete);
router.post("/add/:id", controller.addPost);
router.patch("/update", controller.updatePatch);
module.exports = router;
