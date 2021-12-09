const express = require("express");
const router = express.Router();
const {
  registerController,
  activationController,
  loginController,
} = require("../controllers/auth.controler.js");
const {
  validSign,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid.js");

router.post("/register", validSign, registerController);
router.post("/activation", activationController);
router.post("/login", validLogin, loginController);

module.exports = router;
