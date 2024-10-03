const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
router.get("/", accountController.index);
router.get("/create", accountController.create);
module.exports = router;
