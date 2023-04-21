const path = require("path");

const express = require("express"); // To Configure the Routes and Server Logic

const mongoose = require("mongoose"); //To work with mongoDB Database

require("dotenv").config(); // to Srore the Env Variables

const session = require("express-session"); //For Creating Sessions

const MogoStore = require("connect-mongodb-session")(session); //To store Sessions in Database

const multer = require("multer");

const bodyparser = require("body-parser");

const { check, body, validationResult } = require("express-validator");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/authentication");
const pageNotFound = require("./middleware/404");

const authControllere = require("./controller/authentication");

const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const app = express();

const store = new MogoStore({
  uri: MongoURL,
  collection: "sessions",
});

const diskStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./public/profilePics"), (err, res) => {
      if (err) throw err;
    });
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname, (err, res) => {
      if (err) throw err;
    });
  },
});

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

const upload = multer({ storage: diskStore, fileFilter: fileFilter });

//for getting input json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));

// session Middleware
app.use(
  session({
    secret: "keepitsecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//Storing a user in req Object
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((reqUser) => {
      req.user = reqUser;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", authRoutes);
app.use(
  "/api/v1/signup",
  upload.single("profilePic"),
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
app.use(pageNotFound);

mongoose
  .connect(MongoURL)
  .then(() => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Srikanth",
    //       email: "srikanth@test.com",
    //       password: "1234",
    //     });
    //     user.save();
    //   }
    // });
    app.listen(port, () => {
      console.log("Server running on", port);
    });
  })
  .catch((err) => console.log(err));
