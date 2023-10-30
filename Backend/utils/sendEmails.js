const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dckapjournal@gmail.com",
        pass: "okrcsfogyorqnjqo",
      },
    });

    await transporter.sendMail({
      from: "dckapjournal@gmail.com",
      to: email,
      subject: subject,
      html: html,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
