const express = require("express"); // To Configure the Routes and Server Logic

const mongoose = require("mongoose"); //To work with mongoDB Database

require("dotenv").config(); // to Srore the Env Variables

const session = require("express-session"); //For Creating Sessions

const MogoStore = require("connect-mongodb-session")(session); //To store Sessions in Database

const bodyparser = require("body-parser");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/authentication");
const pageNotFound = require("./middleware/404");

const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const app = express();

const store = new MogoStore({
  uri: MongoURL,
  collection: "sessions",
});

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
app.use(pageNotFound);

mongoose
  .connect(MongoURL)
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on", port);
    });
  })
  .catch((err) => console.log(err));
