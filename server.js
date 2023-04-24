const mongoose = require("mongoose");
const express = require("express");

const app = express();

const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const server = function () {
  mongoose
    .connect(MongoURL)
    .then(() => {
      app.listen(port, () => {
        console.log("Server running on", port);
      });
    })
    .catch((err) => console.log(err));
};

module.exports = server;