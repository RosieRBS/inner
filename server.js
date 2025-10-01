import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import formData from "form-data";
import Mailgun from "mailgun.js";

// ---------------------------
// Setup
// ---------------------------
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// For ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve front-end files
app.use(express.static(path.join(__dirname)));

// ---------------------------
// Email transporter (Mailgun)
// ---------------------------
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.mailgun.net",
});

// ---------------------------
// POST endpoint to send results
// ---------------------------
app.post("/send-results", async (req, res) => {
  const { email, score, testType } = req.body;
  let interpretation = "";

  if (!email || (!score && score !== 0) || !testType) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  if (testType === "ТОКСИК ЗАН ТӨЛӨВИЙГ ТОДОРХОЙЛОХ ТЕСТ") {
    if (score >= 121) {
      interpretation =
        "Таны харилцаанд токсик зан төлөв маш тод илэрч байна. Хяналт тавих, бусдыг манипуляци хийх, байнга буруутгах, уур бухимдалтай байх зэрэг нь таны харилцааг ноцтойгоор хордуулж байна. Энэ нь таны хувийн амьдрал болон ойр дотны хүмүүст тань сөргөөр нөлөөлж байгаа тул мэргэжлийн сэтгэл зүйчийн тусламж авахыг зөвлөж байна.";
    } else if (score >= 91 && score <= 120) {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг нэлээд их байна. Бусдыг удирдах, шүүмжлэх, сэтгэл санааны хувьд дарамтлах, хариуцлагаас зайлсхийх зэрэг асуудлууд гарч болзошгүй. Эдгээр зан төлөв нь таны хувийн болон бусдын амьдралд сөргөөр нөлөөлж байна.";
    } else if (score >= 61 && score <= 90) {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн зарим шинж тэмдэг ажиглагдаж магадгүй. Заримдаа хянах, шүүмжлэх, эсвэл бусдын мэдрэмжийг үл тоомсорлох зэрэг байдал илэрч болно. Өөрийн харилцааны хэв маягийг сайжруулахад анхаарвал зохино.";
    } else {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг маш бага эсвэл огт байхгүй. Та бусадтай эрүүл, эерэг харилцааг бий болгохыг эрмэлздэг.";
    }
  } 
  
  else if (testType === "СТРЕССИЙГ ТОДОРХОЙЛОХ ТЕСТ") {
    if (score >= 121) {
      interpretation =
        "Таны сэтгэлзүйн болон бие махбодийн шинж тэмдэг маш тод илэрч байна. Та яаралтай мэргэжлийн тусламж авахыг зөвлөж байна.";
    } else if (score >= 91 && score <= 120) {
      interpretation =
        "Танд тодорхой сэтгэлзүйн болон бие махбодийн шинж тэмдэг илэрч байна. Энэ нь таны амьдралд нөлөөлж байгаа бол сэтгэлзүйчтэй уулзах хэрэгтэй.";
    } else if (score >= 61 && score <= 90) {
      interpretation =
        "Танд зарим шинж тэмдэг ажиглагдаж магадгүй. Стресс удирдах, амралт авах, эрүүл зуршлыг хэвшүүлэхэд анхаараарай.";
    } else {
      interpretation =
        "Танд сэтгэлзүйн болон бие махбодийн шинж тэмдэг бараг ажиглагдахгүй байна. Та эрүүл хэв маягтай байна.";
    }
  }

  const subject = `hellooooo ${testType} Results Are Ready 🎉`;
  const text = `Hi there!\n\nThank you for taking the "${testType}".\n\nYour score: ${score}/150\n\n ${interpretation}\n\nWe hope this helps you!`;

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Quiz App <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject,
      text,
    });

    console.log(`✅ Email sent to ${email} for ${testType}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
