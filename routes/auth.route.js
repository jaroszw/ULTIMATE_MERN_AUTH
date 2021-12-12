const express = require('express');
const router = express.Router();
const {
  registerController,
  activationController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  facebookController,
} = require('../controllers/auth.controler.js');
const {
  validSign,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../helpers/valid.js');

router.post('/register', validSign, registerController);
router.post('/activation', activationController);
router.post('/login', validLogin, loginController);
router.post(
  '/forgotpassword',
  forgotPasswordValidator,
  forgotPasswordController
);
router.put('/ressetpassword', resetPasswordValidator, resetPasswordController);
router.post('/googleLogin', googleController);
router.post('/facebookLogin', facebookController);

module.exports = router;
