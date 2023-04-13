const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require("dotenv").config();

const adminRoutes = require('./routes/admin');
// const userRoutes = require('./routes/user');
const pageNotFound = require('./middleware/404');

const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/admin', adminRoutes);
// app.use('/api/v1', userRoutes);
app.use(pageNotFound);

mongoose
  .connect(MongoURL)
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on", port);
    });
  })
  .catch((err) => console.log(err));
