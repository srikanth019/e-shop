const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(401).json({ msg: "Not authenticated" });
  }
  const token = bearerHeader.split(" ")[1];
  // console.log(token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res.send("Not Authenticated");
    }
    console.log(decodedToken);
    req.user = await User.findById(decodedToken.loadedUser._id);
    // const user = await User.findById(decodedToken.loadedUser._id);
    // let user = await User.updateOne(
    //   { _id: decodedToken.loadedUser._id },
    //   { $set: { Token: token } }
    // );
    // user.Token = token;
    // await user.save()
    // console.log(user);
    // req.user = user;
  } catch (err) {
    return res.send({ msg: err });
  }
  //   console.log(req.user);
  next();
};
