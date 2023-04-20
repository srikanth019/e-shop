const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'mailto:srikanth.golla@brainvire.com',
      pass: 'Srik@nth19'
  }
});

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const profilePic = req.file.filename;
  User.findOne({ email: email })
    .then((userDoc) => {
      // console.log(userDoc);
      if (userDoc) {
        return res.json({
          msg: "This E-mail Already Exit. Please Pick Another."
        });
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPass) => {
          const user = new User({
            name: name,
            email: email,
            password: hashPass,
            profilePic: profilePic,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((response) => {
          // console.log(response);
          var mailOptions = {
            to: email,
            from: 'mailto:srikanth.golla@brainvire.com',
            subject: "You are successfully Signedup",
            text: 'Hello from Node-Project',
            html: `<h1>You Successfully Signedup Node E-Shop PlatForm.</h1>
                <p>Your password is: "${password}" </p>
                <p>Thank You</p>
            `
          }
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          res.json({ msg: "SignUp Successfully", status: response });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err._message);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.json({ msg: "Incorrect E-Mail!!!" });
      }
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          console.log(match);
          if (match) {
            // req.session.isLogin = true;
            req.session.user = user;
            res.json({ msg: "Login Successfully" });
          }
          if(!match){
            return res.json({ msg: "failed to login , Incorrect password!!!" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err.msg);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.send({ msg: "Logout Successfully" });
  });
};
