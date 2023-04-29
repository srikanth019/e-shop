const express = require("express"); // To Configure the Routes and Server Logic
require("dotenv").config(); // to Srore the Env Variables
const compression = require("compression");
const connect = require("./config/db");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/authentication");
const pageNotFound = require("./middleware/404");
const errorHandler = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(compression());

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1", authRoutes);
app.use(pageNotFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log("listening on port:", process.env.PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
