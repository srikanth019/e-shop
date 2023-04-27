const express = require("express");

const router = express.Router();

const authControllere = require("../controller/authentication");

const profileUpload = require('../utils/upload');

const { signupValidation, loginValidation } = require("../utils/validation");

router.post(
  "/signup",
  profileUpload.uploadUserProfile,
  signupValidation,
  authControllere.postSignUp
);

router.post('/user/verify/:id/:token', authControllere.userVerification);

router.post('/reset-password', authControllere.resetPasswordEmail)

router.post('/new-password/:id/:token', authControllere.resetPassword);

router.post("/login", loginValidation, authControllere.postLogin);

router.post("/logout", authControllere.postLogout);

module.exports = router;
