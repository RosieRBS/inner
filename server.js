import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import formData from "form-data";
import Mailgun from "mailgun.js";
import fetch from "node-fetch";// ✅ needed for QPay API calls
import bodyParser from "body-parser";
import fs from "fs";
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
// ---------------------------
// 🔹 QPay Integration
// ---------------------------
// ---------------------------
// 🔹 QPay Integration (Fixed)
// ---------------------------
const QPAY_BASE_URL = process.env.QPAY_SANDBOX === "true"
  ? "https://merchant-sandbox.qpay.mn/v2"
  : "https://merchant.qpay.mn/v2";

const QPAY_USERNAME = process.env.QPAY_USERNAME;
const QPAY_PASSWORD = process.env.QPAY_PASSWORD;
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE; // Must match QPay dashboard

// Encode credentials for Basic Auth
const basicAuth = Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString("base64");

// Get access token
async function getAccessToken() {
  const res = await fetch(`${QPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`,
    },
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error("❌ Failed to parse QPay auth response:", e);
    throw e;
  }

  if (!res.ok || !data.access_token) {
    console.error("❌ QPay auth error:", data);
    throw new Error("Failed to get QPay token");
  }

  return data.access_token;
}

// Create a new invoice
async function createInvoice({ amount, email, testType }) {
  const token = await getAccessToken();

  const invoiceData = {
    invoice_code: process.env.QPAY_INVOICE_CODE, // must be live invoice code
    sender_invoice_no: Date.now().toString(),
    invoice_receiver_code: "terminal",
    invoice_description: `Тестийн төлбөр (${testType})`,
    amount,
  };

  console.log("🟢 Sending to QPay:", invoiceData);

  const res = await fetch(`${QPAY_BASE_URL}/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  });

  const text = await res.text(); // 🔹 log raw response
  console.log("🟢 QPay raw response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("❌ Failed to parse JSON from QPay:", e);
    throw new Error("Invalid JSON response from QPay (check logs for HTML/error)");
  }

  if (!res.ok || !data.invoice_id) {
    console.error("❌ QPay invoice creation failed:", data);
    throw new Error("Failed to create invoice");
  }

  console.log(`✅ Invoice created for ${email}:`, data.invoice_id);
  return data;
}


// Check payment status
async function checkPayment(invoiceId) {
  const token = await getAccessToken();

  const res = await fetch(`${QPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error("❌ Failed to parse JSON from QPay payment check:", e);
    throw e;
  }

  if (!res.ok) {
    console.error("❌ QPay payment check error:", data);
    throw new Error("Failed to check payment");
  }

  return data;
}

// ---------------------------
// 💳 Endpoint: Start payment
// ---------------------------
app.post("/start-payment", async (req, res) => {
  try {
    const { email, testType } = req.body;
    const amount = 1; // price in MNT

    const invoice = await createInvoice({ amount, email, testType });

    // Return QR image & invoice_id to frontend
    res.json({
      success: true,
      invoice_id: invoice.invoice_id,
      qr_image: invoice.qr_image,
      urls: invoice.urls, // bank app URLs
    });
  } catch (err) {
    console.error("❌ Failed to start QPay payment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------------
// 💰 Endpoint: Check payment & send email
// ---------------------------
app.post("/check-payment", async (req, res) => {
  const { invoice_id, email, score, testType } = req.body;

  try {
    const payment = await checkPayment(invoice_id);

    const isPaid =
      payment.payment_status === "PAID" ||
      (payment.rows && payment.rows.some((p) => p.payment_status === "PAID"));

    if (isPaid) {
      console.log(`💸 Payment confirmed for ${email}`);

      const subject = `${testType} — Таны үр дүн 🎉`;
      const text = `Сайн байна уу!\n\n"${testType}" тестийн таны оноо: ${score}/150\n\nБаяр хүргэе, таны төлбөр амжилттай баталгаажсан.\n\nINNER.mn баг`;

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `INNER <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject,
        text,
      });

      return res.json({
        success: true,
        paid: true,
        message: "Payment confirmed and email sent.",
      });
    } else {
      return res.json({
        success: true,
        paid: false,
        message: "Payment not yet completed.",
      });
    }
  } catch (err) {
    console.error("❌ Error checking payment:", err);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
});

// ---------------------------
// Existing: POST /send-results
// ---------------------------
// app.post("/send-results", async (req, res) => {
//   const { email, score, testType } = req.body;
//   let interpretation = "";
//   let explanation = "";

//   if (!email || (!score && score !== 0) || !testType) {
//     return res.status(400).json({ success: false, message: "Invalid input" });
//   }

//   // Interpret result
//   if (testType === "sectionsTest1") {
//     if (score >= 121) {
//       interpretation =
//         "Таны харилцаанд токсик зан төлөв маш тод илэрч байна. Хяналт тавих, бусдыг манипуляци хийх, байнга буруутгах, уур бухимдалтай байх зэрэг нь таны харилцааг ноцтойгоор хордуулж байна. Энэ нь таны хувийн амьдрал болон ойр дотны хүмүүст тань сөргөөр нөлөөлж байгаа тул мэргэжлийн сэтгэл зүйчийн тусламж авахыг зөвлөж байна.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг нэлээд их байна. Бусдыг удирдах, шүүмжлэх, сэтгэл санааны хувьд дарамтлах, хариуцлагаас зайлсхийх зэрэг асуудлууд гарч болзошгүй. Эдгээр зан төлөв нь таны хувийн болон бусдын амьдралд сөргөөр нөлөөлж байна.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Таны харилцаанд токсик зан төлөвийн зарим шинж тэмдэг ажиглагдаж магадгүй. Заримдаа хянах, шүүмжлэх, эсвэл бусдын мэдрэмжийг үл тоомсорлох зэрэг байдал илэрч болно. Өөрийн харилцааны хэв маягийг сайжруулахад анхаарвал зохино.";
//     } else {
//       interpretation =
//         "Таны харилцаанд токсик зан төлөвийн шинж тэмдэг маш бага эсвэл огт байхгүй. Та бусадтай эрүүл, эерэг харилцааг бий болгохыг эрмэлздэг.";
//     }
//     explanation = "Энэхүү тест нь мэргэжлийн оношлогоо биш бөгөөд зөвхөн таны харилцааны хэв маягийн талаарх өөрийгөө үнэлэхэд туслах зорилготой юм. Хэрэв та өөрийн эсвэл бусдын харилцаан дахь токсик зан төлөвийн талаар санаа зовж байгаа бол мэргэжлийн сэтгэл зүйч эсвэл харилцааны зөвлөхөөс тусламж авах нь чухал. Өөрийн зан төлөвийг өөрчлөх нь эхлээд өөрийгөө танихаас эхэлдэг.";
//   } else if (testType === "sectionsTest2") {
//     if (score >= 121) {
//       interpretation =
//         "Стрессийн түвшин маш өндөр. Та хүнд хэлбэрийн стресст өртсөн байж болзошгүй бөгөөд олон тооны сэтгэл зүйн, бие махбодийн, зан төлөвийн шинж тэмдгүүд илэрч байна. Энэ нь таны эрүүл мэндэд ноцтой аюул учруулж болзошгүй тул яаралтай мэргэжлийн сэтгэл зүйч эсвэл эмчид хандаж, тусламж авахыг зөвлөж байна. Ялангуяа 30-р асуултад өндөр оноо өгсөн бол нэн даруй мэргэжлийн тусламж аваарай.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Стрессийн түвшин нэлээд өндөр. Та байнга стрессийн шинж тэмдгүүдийг мэдэрч, энэ нь таны сэтгэл зүйн болон бие махбодийн эрүүл мэнд, ажлын гүйцэтгэл, хувийн харилцаанд сөргөөр нөлөөлж байна. Стрессээ удирдах арга барил эзэмшиж, шаардлагатай бол мэргэжлийн тусламж авах талаар бодох цаг болжээ.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Стрессийн түвшин дунд зэрэг. Та заримдаа стрессийн шинж тэмдгүүдийг мэдэрдэг ч, энэ нь таны өдөр тутмын амьдралд ихээхэн нөлөөлөхгүй байна. Стрессээ удирдах арга барилаа сайжруулах талаар бодох нь зүйтэй.";
//     } else {
//       interpretation =
//         "Стрессийн түвшин маш бага эсвэл огт байхгүй. Та стресстэй нөхцөл байдалд сайн дасан зохицож, сэтгэл зүйн хувьд эрүүл байна.";
//     }
//     explanation = "Энэхүү тест нь мэргэжлийн оношлогоо биш бөгөөд зөвхөн таны стрессийн түвшний талаарх өөрийгөө үнэлэхэд туслах зорилготой юм. Хэрэв та өндөр оноо авсан бол эсвэл өөрийгөө стресстэй байна гэж үзвэл, мэргэжлийн сэтгэл зүйч, эмч эсвэл зөвлөхөөс тусламж авах нь чухал юм.";
//   } else if (testType === "sectionsTest3") {
//     if (score >= 121) {
//       interpretation =
//         "Сэтгэл хөдлөлөө удирдах чадамж маш өндөр. Сэтгэл хөдлөлөө бүрэн хянаж, бусадтай үр дүнтэй харилцаж, тэднийг урамшуулан дэмжих чадвартай.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Сэтгэл хөдлөлөө удирдах чадамж сайн. Өөрийгөө болон бусдыг ойлгох, харилцаагаа зохицуулах чадвартай.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Сэтгэл хөдлөлөө удирдах чадамж дунд зэрэг. Заримдаа сэтгэл хөдлөлөө хянах, бусадтай харилцахад бэрхшээл тулгардаг байж болно.";
//     } else {
//       interpretation =
//         "Сэтгэл хөдлөлөө удирдах чадамж харьцангуй доогуур. Өөрийгөө болон бусдыг ойлгох, харилцаагаа сайжруулах тал дээр анхаарах шаардлагатай.";
//     }
//     explanation = "";
//   } else if (testType === "sectionsTest4") {
//     if (score >= 121) {
//       interpretation =
//         "Үнэн байх чадвар маш өндөр. Та үргэлж шударга, үнэнч, зарчимч байдаг. Таны үг, үйлдэл хоёр үргэлж хоорондоо таарч, таны нэр хүнд маш өндөр байдаг. Та бусдын итгэлийг бүрэн хүлээж, нийгэм болон ажил дээрээ манлайлагч нэгэн байдаг.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Үнэн байх чадвар сайн. Та ихэнх тохиолдолд шударга, үнэнч, найдвартай байдаг. Таны ёс зүйн зарчмууд тодорхой бөгөөд та түүнийгээ баримтлахыг хичээдэг. Энэ нь бусдын итгэлийг хүлээж, эргэн тойронд тань эерэг нөлөө үзүүлдэг.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Үнэн байх чадвар дунд зэрэг. Та ихэнх тохиолдолд үнэнч байхыг хичээдэг ч, заримдаа дарамт эсвэл ашиг сонирхлын үед зарчимдаа үнэнч байж чаддаггүй байж магадгүй. Өөрийн үнэт зүйлсээ тодорхойлж, хүнд нөхцөлд ч түүндээ үнэнч байхыг хичээх нь зүйтэй.";
//     } else {
//       interpretation =
//         "Үнэн байх чадвар харьцангуй доогуур. Та шударга байдал, ёс зүйн зарчмуудаа баримтлахад бэрхшээлтэй байдаг. Үнэнч байдал, хариуцлага хүлээх, бусдын итгэлийг хүндлэх тал дээр анхаарах шаардлагатай. Энэ нь таны хувийн болон мэргэжлийн харилцаанд сөргөөр нөлөөлж болзошгүй.";
//     }
//     explanation = "Энэхүү тест нь мэргэжлийн оношлогоо биш бөгөөд зөвхөн таны үнэн байх хандлагын талаарх өөрийгөө үнэлэхэд туслах зорилготой юм. Үнэн байх чадвар нь хувь хүний мөн чанар боловч байнга сайжруулж болох ур чадвар юм. ";
//   } else if (testType === "sectionsTest5") {
//     if (score >= 121) {
//       interpretation =
//         "Өөрийгөө үнэлэх чадвар маш өндөр. Та өөрийгөө гүнзгий ойлгож, давуу болон сул талуудаа бодитойгоор үнэлдэг. Та өөртөө итгэлтэй, хариуцлагатай бөгөөд алдаанаасаа суралцан, байнга өсөн дэвжихийг эрмэлздэг. Таны энэ чадвар нь таныг өөрийгөө удирдах, зорилгодоо хүрэх, эрүүл харилцааг бий болгоход чухал үүрэг гүйцэтгэдэг.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Өөрийгөө үнэлэх чадвар сайн. Та өөрийн давуу, сул талыг бодитойгоор үнэлж, өөрийгөө хөгжүүлэхийн төлөө хичээдэг. Та бусдын шүүмжлэлийг хүлээн авч, өөрийн шийдвэр, үйлдлээ эргэцүүлэн дүгнэж чаддаг. Энэ нь таны хувийн болон мэргэжлийн амьдралд эерэг нөлөө үзүүлдэг.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Өөрийгөө үнэлэх чадвар дунд зэрэг. Та өөрийнхөө талаар тодорхой ойлголттой ч, заримдаа өөрийгөө хэт өндөр эсвэл хэт доогуур үнэлэх хандлагатай байж магадгүй. Бусдын шүүмжлэлийг хүлээн авах, өөрийн мэдрэмж, бодлыг гүнзгийрүүлэн ойлгох, алдаанаасаа суралцахад анхаарлаа хандуулах нь зүйтэй.";
//     } else {
//       interpretation =
//         "Өөрийгөө үнэлэх чадвар харьцангуй доогуур. Та өөрийн давуу, сул талыг тодорхой мэдэхгүй байх эсвэл өөрийгөө бодитойгоор үнэлэхэд бэрхшээлтэй байдаг. Өөртөө итгэлгүй байх, эсвэл хэт их өөрийгөө шүүмжлэх хандлагатай байж болно. Өөрийгөө таних, өөрийгөө хүлээн зөвшөөрөх, алдаанаасаа суралцах тал дээр анхаарах шаардлагатай.";
//     }
//     explanation = "Энэхүү тест нь мэргэжлийн оношлогоо биш бөгөөд зөвхөн таны өөрийгөө үнэлэх хандлагын талаарх өөрийгөө үнэлэхэд туслах зорилготой юм. Өөрийгөө үнэлэх чадвар бол байнга хөгжүүлж болох ур чадвар юм. ";
//   } else if (testType === "sectionsTest6") {
//     if (score >= 121) {
//       interpretation =
//         "Эмпатийн түвшин маш өндөр. Та бусдын мэдрэмж, бодол санааг гүн гүнзгий ойлгож, мэдэрч чаддаг. Таны эмпатийн чадвар нь бусадтай хүчтэй холбоо тогтоох, үр дүнтэй харилцах, мөн эргэн тойронд байгаа хүмүүстээ эерэг нөлөө үзүүлэхэд тусалдаг. Та магадгүй -эмпатик хүн- гэж нэрлэгдэх нь олонтаа.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Эмпатийн түвшин сайн. Та ихэнх тохиолдолд бусдын мэдрэмж, бодол санааг ойлгож, тэдэнд туслахыг хичээдэг. Таны эмпатийн чадвар нь харилцаа болон нийгмийн амьдралд тань эергээр нөлөөлдөг.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Эмпатийн түвшин дунд зэрэг. Та заримдаа бусдын мэдрэмжийг ойлгодог ч, бүрэн дүүрэн мэдэрч, хариу үйлдэл үзүүлж чаддаггүй байж магадгүй. Идэвхтэй сонсох, өөрийгөө бусдын оронд тавих дасгалууд хийх нь зүйтэй.";
//     } else {
//       interpretation =
//         "Эмпатийн түвшин харьцангуй доогуур. Та бусдын мэдрэмж, хэрэгцээг ойлгоход бэрхшээлтэй байж болно. Харилцаа, бусдыг ойлгох чадвараа хөгжүүлэхэд илүү анхаарах шаардлагатай.";
//     }
//     explanation = "Энэхүү тест нь мэргэжлийн оношлогоо биш бөгөөд зөвхөн таны эмпатийн түвшний талаарх өөрийгөө үнэлэхэд туслах зорилготой юм. Эмпати бол байнга хөгжүүлж болох ур чадвар юм. ";
//   } else if (testType === "sectionsTest7") {
//     if (score >= 121) {
//       interpretation =
//         "Шүүмжлэлт сэтгэлгээ маш өндөр. Та аливаа мэдээлэлд шүүмжлэлтэй хандаж, нарийн төвөгтэй асуудлыг ч амжилттай шийдвэрлэх чадвартай.";
//     } else if (score >= 91 && score <= 120) {
//       interpretation =
//         "Шүүмжлэлт сэтгэлгээ сайн. Та ихэнх тохиолдолд мэдээллийг үнэлж, логик үндэслэлтэй дүгнэлт гаргаж чаддаг.";
//     } else if (score >= 61 && score <= 90) {
//       interpretation =
//         "Шүүмжлэлт сэтгэлгээ дунд зэрэг. Заримдаа асуудлыг гүнзгийрүүлэн судлах, логик алдааг олоход бэрхшээл тулгардаг байж болно.";
//     } else {
//       interpretation =
//         "Шүүмжлэлт сэтгэлгээ харьцангуй доогуур. Мэдээлэлд дүн шинжилгээ хийх, үндэслэлтэй дүгнэлт гаргах тал дээр анхаарах шаардлагатай.";
//     }
//     explanation = "";
//   } 

//   const subject = `${testType} — Таны үр дүн 🎉`;
//   const text = `Сайн байна уу!\n\n"${testType}" тестийн таны оноо: ${score}/150\n\n${interpretation}\n\n${explanation}INNER.mn баг`;

//   try {
//     await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//       from: `INNER <postmaster@${process.env.MAILGUN_DOMAIN}>`,
//       to: [email],
//       subject,
//       text,
//     });

//     console.log(`✅ Email sent to ${email} for ${testType}`);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error sending email:", err);
//     res.status(500).json({ success: false, message: "Failed to send email" });
//   }
// });

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
















