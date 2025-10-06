import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import formData from "form-data";
import Mailgun from "mailgun.js";
import fetch from "node-fetch"; // ✅ needed for QPay API calls

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
  url: "https://api.eu.mailgun.net",
});

// ---------------------------
// 🔹 QPay Integration
// ---------------------------

// Get QPay token (merchant auth)
async function getQPayToken() {
  const response = await fetch("https://merchant-sandbox.qpay.mn/v2/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.QPAY_USERNAME,
      password: process.env.QPAY_PASSWORD,
    }),
  });
  const data = await response.json();
  return data.access_token;
}

// Create invoice
app.post("/create-invoice", async (req, res) => {
  try {
    const { amount, email, testType } = req.body;
    const token = await getQPayToken();

    const invoiceRes = await fetch("https://merchant-sandbox.qpay.mn/v2/invoice", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_code: process.env.QPAY_INVOICE_CODE, // e.g. TEST_INVOICE
        sender_invoice_no: `INV-${Date.now()}`,
        invoice_receiver_code: email,
        invoice_description: `Payment for ${testType}`,
        amount: amount || 1000, // change if needed
        callback_url: "https://inner.mn/payment-callback", // optional
      }),
    });

    const data = await invoiceRes.json();
    if (!invoiceRes.ok) throw new Error(data.detail || "Failed to create invoice");

    res.json({
  success: true,
  qrImage: `data:image/png;base64,${data.qr_image}`,
  invoice_id: data.invoice_id,
});

  } catch (err) {
    console.error("❌ QPay invoice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check payment status
app.get("/check-invoice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getQPayToken();

    const checkRes = await fetch(`https://merchant-sandbox.qpay.mn/v2/payment/check/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await checkRes.json();
    if (!checkRes.ok) throw new Error(data.detail || "Failed to check invoice");

    res.json({ success: true, paid: data.paid_amount >= data.amount });
  } catch (err) {
    console.error("❌ QPay check error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------------
// Existing: POST /send-results
// ---------------------------
app.post("/send-results", async (req, res) => {
  const { email, score, testType } = req.body;
  let interpretation = "";

  if (!email || (!score && score !== 0) || !testType) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  // Interpret result
  if (testType === "ТОКСИК ЗАН ТӨЛӨВИЙГ ТОДОРХОЙЛОХ ТЕСТ") {
    if (score >= 121) {
      interpretation =
        "Таны харилцаанд токсик зан төлөв маш тод илэрч байна...";
    } else if (score >= 91 && score <= 120) {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг нэлээд их байна...";
    } else if (score >= 61 && score <= 90) {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн зарим шинж тэмдэг ажиглагдаж магадгүй...";
    } else {
      interpretation =
        "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг маш бага эсвэл огт байхгүй...";
    }
  } else if (testType === "СТРЕССИЙГ ТОДОРХОЙЛОХ ТЕСТ") {
    if (score >= 121) {
      interpretation =
        "Таны сэтгэлзүйн болон бие махбодийн шинж тэмдэг маш тод илэрч байна...";
    } else if (score >= 91 && score <= 120) {
      interpretation =
        "Танд тодорхой сэтгэлзүйн болон бие махбодийн шинж тэмдэг илэрч байна...";
    } else if (score >= 61 && score <= 90) {
      interpretation =
        "Танд зарим шинж тэмдэг ажиглагдаж магадгүй...";
    } else {
      interpretation =
        "Танд сэтгэлзүйн болон бие махбодийн шинж тэмдэг бараг ажиглагдахгүй байна...";
    }
  }

  const subject = `${testType} — Таны үр дүн 🎉`;
  const text = `Сайн байна уу!\n\n"${testType}" тестийн таны оноо: ${score}/150\n\n${interpretation}\n\nINNER.mn баг`;

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `INNER <postmaster@${process.env.MAILGUN_DOMAIN}>`,
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
