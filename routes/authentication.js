const express = require("express");

const router = express.Router();

const authControllere = require("../controller/authentication");

const { check, body } = require("express-validator");

router.post(
  "/signup",
  authControllere.uploadUserProfile,
  // upload.single("profilePic"),
  [
    check("name").isAlphanumeric().isLength({ min: 3 }).trim(),
    check("email", "Email Field is required").not().isEmpty(),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid E-mail")
      .normalizeEmail()
      .trim(),
    body("password", "Password Field is required").not().isEmpty(),
    body(
      "password",
      "Please Enter a password with Only numbers and text with atleast 4 characters"
    )
      .isLength({ min: 4, max: 10 })
      .isAlphanumeric()
      .trim(),
  ],
  authControllere.postSignUp
);

router.post(
  "/login",
  [
    check("email", "Email Field is required").not().isEmpty(),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid E-mail")
      .normalizeEmail()
      .trim(),
    body("password", "Password Field is required").not().isEmpty(),
    body(
      "password",
      "Please Enter a password with Only numbers and text with atleast 4 characters"
    )
      .isLength({ min: 4, max: 10 })
      .isAlphanumeric()
      .trim(),
  ],
  authControllere.postLogin
);

router.post("/logout", authControllere.postLogout);

module.exports = router;
