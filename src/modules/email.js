const email = {};

const nodemailer = require("nodemailer");
require("dotenv").config();

email.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

email.getPasswordResetURL = (user, token) =>
  `http://localhost:3000/password/reset/${user._id}/${token}`;

email.resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "Password Reset";
  const html = `
  <p>Hola ${user.name || user.email},</p>
  <a href=${url}>${url}</a>
  <p> Si no usa este enlace dentro de 1 hora, caducará.</p>
  `;

  return { from, to, subject, html };
};

module.exports = email;
