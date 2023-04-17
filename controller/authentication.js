const User = require("../models/user");

exports.postSignUp = (req, res, next) => {
  res.send({ msg: "SignUp Successfully" });
};

exports.postLogin = (req, res, next) => {
  User.findById("6438ef587d95995c7a030677")
    .then((user) => {
      console.log(user);
      req.session.isLogin = true;
      req.session.user = user;
    //   req.session.save(err => {
    //     console.log(err);
    //   })
      res.send({ msg: "Login Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(req.session.user);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.send({ msg: "Logout Successfully" });
  });
};
