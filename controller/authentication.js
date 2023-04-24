const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const multer = require("multer");
const { validationResult } = require("express-validator");
const transporter = require("../middleware/email");

const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const maxSize = 2 * 1024 * 1024;
const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
  limits: { fieldSize: maxSize },
});

const uploadProfile = upload.single("profilePic");

exports.uploadUserProfile = (req, res, next) => {
  upload.single("profilePic")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(404).send(err + "Upload failed due to multer error");
    } else if (err) {
      console.log(err);
      return res.status(404).send(err + "Upload failed due to unknown error");
    }
    // console.log("Every thing is fine with Fine Uploading");
    next();
  });
};

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
    return res.json({
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
    email: email,
    password: hashPass,
    profilePic: profilePic,
    cart: { items: [] },
  });
  const response = await user.save();
  // console.log(response);
  var mailOptions = {
    to: email,
    from: "mailto:srikanth.golla@brainvire.com",
    subject: "You are successfully Signedup",
    text: "Hello from Node-Project",
    html: `<h1>You Successfully Signedup Node E-Shop PlatForm.</h1>
                <p>Your password is: "${password}" </p>
                <p>Thank You</p>
            `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.json({ msg: "SignUp Successfully", user: response });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.json({ msg: "Incorrect E-Mail!!!" });
      }
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          console.log(match);
          if (match) {
            // req.session.isLogin = true;
            req.session.user = user;
            res.json({ msg: "Login Successfully" });
          }
          if (!match) {
            return res.json({ msg: "failed to login , Incorrect password!!!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err.msg);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.send({ msg: "Logout Successfully" });
  });
};
