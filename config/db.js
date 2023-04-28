const mongoose = require("mongoose");

const MongoURL = process.env.MONGO_URL;

const connect = async () => {
  await mongoose.connect(MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connect;
