const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/email");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.postSignUp = async (req, res, next) => {
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
    console.log(errors.array());
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
  const hashPass = await bcrypt.hash(password, 12);

  await sharp(profileBuffer)
    .resize(360, 360)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/profilePics/${newFilename}`);
  console.log("File Uploaded Locally");

  const user = new User({
    name: name,
    email: email.toLowerCase(),
    password: hashPass,
    profilePic: profilePic,
    cart: { items: [] },
  });
  const response = await user.save();
  
  text = `<h1>You Successfully Signedup Node E-Shop PlatForm.</h1>
  <p>Your password is: "${password}" </p>
  <p>Thank You</p>
`;
  await sendEmail(email, "You are successfully Signedup", text);
  res.json({ msg: "SignUp Successfully", user: response });
};

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
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((match) => {
      console.log(match);
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
      console.log(err.msg);
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
  console.log(token);
  res.send({ msg: "Logout Successfully" });
};
