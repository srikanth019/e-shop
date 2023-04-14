const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require('body-parser');
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const pageNotFound = require("./middleware/404");

const User = require("./models/user");

const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const app = express();

//for getting input json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Storing a user in req Object
app.use((req, res, next) => {
  User.findById("6438ef587d95995c7a030677").then((reqUser) => {
    req.user = reqUser;
    next();
  }).catch(err => {
    console.log(err);
  });
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", userRoutes);
app.use(pageNotFound);

mongoose
  .connect(MongoURL)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Srikanth",
          email: "srikanth@test.com",
          password: "1234",
        });
        user.save();
      }
    });
    app.listen(port, () => {
      console.log("Server running on", port);
    });
  })
  .catch((err) => console.log(err));
