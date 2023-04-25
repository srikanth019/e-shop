const nodemailer = require('nodemailer');

const PassWord = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'mailto:srikanth.golla@brainvire.com',
      pass: PassWord
  }
});

module.exports = transporter;