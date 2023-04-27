const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/email");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.postSignUp = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.json({ msg: "Somthing wrong with File" });
    }
    const profileBuffer = req.file.buffer;
    // const { format } = await sharp(profileBuffer).metadata();
    const filename = req.file.originalname.replace(/\..+$/, "");
    const newFilename = `profile-${filename}-${new Date().toISOString()}.jpeg`;

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    // const profilePic = req.file.filename;
    const profilePic = newFilename;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      return res.json({
        status: "Some Error Occur",
        error: errors.array()[0].msg,
      });
    }

    const userDoc = await User.findOne({ email: email });
    // console.log(userDoc);
    if (userDoc) {
      return res.status(409).json({
        msg: "This E-mail Already Exit. Please Pick Another.",
      });
    }

    await sharp(profileBuffer)
      .resize(360, 360)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`public/profilePics/${newFilename}`);
    console.log("File Uploaded");

    const hashPass = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashPass,
      profilePic: profilePic,
      token: token,
      tokenExpiration: Date.now() + 3600000,
      cart: { items: [] },
    });
    const response = await user.save();

    const verifyEmailUrl = `${process.env.BASE_URL}/api/v1/user/verify/${response._id}/${token}`;

    text = `<p> To Create Your Account Please Verify Email </p>
  <p> Click <a href="${verifyEmailUrl}"> here </a>to verify your email</p>`;
    sendEmail(email, "Email Verification", text);

    res.json({ msg: "Email is sent please varify.", user: response });
  } catch (err) {
    console.log(err);
  }
};

exports.userVerification = (req, res, next) => {
  const userId = req.params.id;
  const token = req.params.token;
  let userEmail;
  User.findOne({
    _id: userId,
    token: token,
    tokenExpiration: { $gt: Date.now() },
  })
    .then((verifyUser) => {
      if (!verifyUser) {
        return res.json({ msg: "Email verification is Failed." });
      }
      userEmail = verifyUser.email;
      userPassword = verifyUser.password;
      verifyUser.isVerified = true;
      verifyUser.token = undefined;
      verifyUser.tokenExpiration = undefined;
      return verifyUser.save();
    })
    .then((response) => {
      text = `<h1>You Successfully Signedup Node E-Shop PlatForm.</h1>
  <p>Thank You</p>
`;
      sendEmail(userEmail, "Email Verification", text);
      res.json({ msg: "User Verified now you can Login" });
    });
};
//
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.json({ msg: "Incorrect E-Mail!!!" });
      }
      if (!user.isVerified) {
        return res.json({
          msg: "User Verification is Required. Please Verify Your Email.",
        });
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((match) => {
      // console.log(match);
      if (match) {
        // req.session.isLogin = true;
        const token = jwt.sign({ loadedUser }, ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });
        // req.session.user = loadedUser;
        res.json({ msg: "Login Successfully", token: token });
      }
      if (!match) {
        return res.json({ msg: "failed to login , Incorrect password!!!" });
      }
    })
    .catch((err) => {
      // console.log(err);
    });
};

exports.resetPasswordEmail = (req, res, next) => {
  const email = req.body.email;
  const token = crypto.randomBytes(32).toString("hex");
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({ msg: "Please enter a valid Email" });
      }
      user.token = token;
      user.tokenExpiration = Date.now() + 300000;
      // console.log(user);
      return user.save();
    })
    .then((resetUser) => {
      const resetPasswordUrl = `${process.env.BASE_URL}/api/v1/reset-password/${resetUser._id}/${token}`;

      text = `<p> You are requested to reset your Passsword</p>
     <p> Click <a href="${resetPasswordUrl}"> here </a>to reset the password</p>`;
      sendEmail(email, "Password Reset", text);
      res.json({ msg: "Email is sent to reset password" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.resetPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.params.id;
  const token = req.params.token;
  User.findOne({
    _id: userId,
    token: token,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.send("Invalid Token");
      }
      if (Date.now() > user.tokenExpiration) {
        return res.send("Your Token is Expired");
      }
      const hashNewPass = bcrypt.hash(newPassword, 12);
      user.password = hashNewPass;
      user.token = undefined;
      user.tokenExpiration = undefined;
      return user.save();
    })
    .then((result) => {
      console.log(result);
      text = `<h1>You are Successfully Changed Your Password.</h1>
    <p>Your New Password is: "${newPassword}" </p>
    <p>Thank You</p>
  `;
      sendEmail(result.email, "Password Changed", text);
      res.json({ msg: "Your Password Is Successfullt Changed" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(401).json({ msg: "Not authenticated" });
  }
  let token = bearerHeader.split(" ")[1];

  req.logOut();
  // token = null;
  // console.log(token);
  res.send({ msg: "Logout Successfully" });
};
