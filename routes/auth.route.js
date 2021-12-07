const express = require("express");
const router = express.Router();

const { registerController } = require("../controllers/auth.controler.js");

router.post("/register", registerController);

module.exports = router;
