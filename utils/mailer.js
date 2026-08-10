const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, userId, token) => {
  const { PAGE_URL } = require("../config");
  
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verification in StyleU",
    html: `<a href="${PAGE_URL}/verify/${userId}/${token}">Verify your email.</a>`,
  });
};

module.exports = sendVerificationEmail;