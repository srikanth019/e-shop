const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email not sent");
    console.log(err);
  }
};

module.exports = sendEmail;
