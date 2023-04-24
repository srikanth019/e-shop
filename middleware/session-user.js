const User = require("../models/user");

const sessionUser = (req, res, next) => {
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
};

module.exports = sessionUser;
