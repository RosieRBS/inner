import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true
});

transporter.sendMail({
  from: `"Test" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "SMTP Test",
  text: "Hello from NodeMailer!"
}, (err, info) => {
  if (err) console.error("❌ Error sending email:", err);
  else console.log("✅ Email sent:", info.response);
});

