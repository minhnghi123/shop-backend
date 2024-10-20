const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgot);
router.post("/password/forgot-password", controller.forgotPost);
router.get("/password/send-otp", controller.sendOtp);
router.post("/password/send-otp", controller.sendOtpPost);
router.get("/password/reset", controller.reset);
router.post("/password/reset", controller.resetPost);
// router.get("/login") ;
module.exports = router;
