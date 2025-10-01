import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import dotenv from "dotenv";
dotenv.config();

const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(mailgunAuth));

transporter.sendMail(
  {
    from: "Quiz App <no-reply@" + process.env.MAILGUN_DOMAIN + ">",
    to: "your_email@example.com",
    subject: "Test Email",
    text: "Hello! This is a test from Mailgun.",
  },
  (err, info) => {
    if (err) console.error(err);
    else console.log(info);
  }
);
