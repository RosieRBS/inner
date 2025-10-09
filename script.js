// ---------------------------
// DOM references
// ---------------------------
// const startTest1Btn = document.getElementById("startTest1");
// const startTest2Btn = document.getElementById("startTest2");
const testDropdown = document.getElementById('testDropdown');
const startSelectedTest = document.getElementById('startSelectedTest');

const startCard = document.getElementById("startCard");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");

const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const emailMessage = document.getElementById("emailMessage");
import { sectionsTest1, sectionsTest2, sectionsTest3, sectionsTest4, sectionsTest5, sectionsTest6, sectionsTest7 } from './quizSections.js';


// ---------------------------
// State
// ---------------------------
let testType = "";
let sections = null;
let currentSection = 0;
let currentQuestion = 0;
let answers = [];
let score = 0;

// ---------------------------
// Start quiz handlers
// ---------------------------
// startTest1Btn.addEventListener("click", () => {
//   testType = "ТОКСИК ЗАН ТӨЛӨВИЙГ ТОДОРХОЙЛОХ ТЕСТ";
//   sections = sectionsTest1;
//   startQuiz();
// });

// startTest2Btn.addEventListener("click", () => {
//   testType = "СТРЕССИЙГ ТОДОРХОЙЛОХ ТЕСТ";
//   sections = sectionsTest2;
//   startQuiz();
// });
const tests = {
  sectionsTest1: sectionsTest1,
  sectionsTest2: sectionsTest2,
  sectionsTest3: sectionsTest3,
  sectionsTest4: sectionsTest4,
  sectionsTest5: sectionsTest5,
  sectionsTest6: sectionsTest6,
  sectionsTest7: sectionsTest7
  
};


testDropdown.addEventListener('change', () => {
  const selectedValue = testDropdown.value;
    sections = tests[selectedValue];
    startSelectedTest.disabled = !sections;
    testType = testDropdown.value;
});
startSelectedTest.addEventListener('click', () => {
    //if (!sections) return;

    // You can keep your logic to show sectionCard or quizCard based on the test
    //startCard.classList.add('hidden');

    // Example logic:
    // currentTest = selectedTest; // global variable to track which test
    // if (testHasIntro(currentTest)) {
    //     sectionCard.classList.remove('hidden');
    //     sectionTitle.textContent = getTestTitle(currentTest);
    //     sectionDescription.textContent = getTestDescription(currentTest);
    // } else {
    //     quizCard.classList.remove('hidden');
    //     loadQuestions(currentTest);
    // }
  startQuiz();
});



function startQuiz() {
  startCard.classList.add("hidden");
  quizCard.classList.remove("hidden"); // show quiz container
  currentSection = 0;
  currentQuestion = 0;
  answers = [];
  showSectionCard();
}

// ---------------------------
// Show section card
// ---------------------------
function showSectionCard() {
  const section = sections[currentSection];
  quizCard.innerHTML = `
    <h2>${section.title}</h2>
    <p>${section.description}</p>
    <button id="continueSectionBtn" class="btn">Continue</button>
  `;
  document.getElementById("continueSectionBtn").addEventListener("click", () => {
    loadQuestion();
  });
}

// ---------------------------
// Load question
// ---------------------------
function loadQuestion() {
  const section = sections[currentSection];
  const q = section.questions[currentQuestion];

  quizCard.innerHTML = `
    <div class="progress">
      <div id="progressText">Question ${currentQuestion + 1} of ${section.questions.length}</div>
      <div class="progress-bar">
        <div id="progressFill" style="width:${(currentQuestion/section.questions.length)*100}%"></div>
      </div>
    </div>
    <h2 id="questionText">${q.text}</h2>
    <p id="reminderText" class="reminder">Choose the option closest to you</p>
    <div id="choices" class="choices"></div>
    <div class="actions">
      <button id="prevBtn" class="btn-ghost" ${currentQuestion===0&&currentSection===0?"disabled":""}>Previous</button>
      <button id="nextBtn" class="btn" disabled>Next</button>
    </div>
  `;

  const choicesContainer = document.getElementById("choices");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const progressFill = document.getElementById("progressFill");

  // Render choices
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.className = "choice-btn";

    btn.addEventListener("click", () => {
      document.querySelectorAll(".choice-btn").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.disabled = false;
      nextBtn.dataset.value = opt.value;
    });

    choicesContainer.appendChild(btn);
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    if(currentQuestion>0){
      currentQuestion--;
      loadQuestion();
    } else if(currentSection>0){
      currentSection--;
      currentQuestion = sections[currentSection].questions.length-1;
      loadQuestion();
    }
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    const selectedBtn = document.querySelector(".choice-btn.selected");
    if(!selectedBtn) return;

    answers.push(Number(nextBtn.dataset.value));

    if(currentQuestion < section.questions.length-1){
      currentQuestion++;
      loadQuestion();
    } else if(currentSection < sections.length-1){
      currentSection++;
      currentQuestion = 0;
      showSectionCard();
    } else {
      showResult();
    }
  });
}

// ---------------------------
// Show result / email form
// ---------------------------
// function showResult(){
//   quizCard.classList.add("hidden");
//   resultCard.classList.remove("hidden");
//   resultCard.innerHTML = `
//     <h2>Your results are in</h2>
//     <p>Your result is ready. We’ll send it to you by email so only you can see it.</p>
//     <form id="emailForm">
//       <input type="email" id="emailInput" placeholder="Enter your email" required />
//       <button type="submit" class="btn">Submit</button>
//     </form>
//     <p id="emailMessage"></p>
//   `;

//   const emailForm = document.getElementById("emailForm");
//   const emailInput = document.getElementById("emailInput");
//   const emailMessage = document.getElementById("emailMessage");

//   emailForm.addEventListener("submit", async (e)=>{
//     e.preventDefault();
//     const email = emailInput.value.trim();
//     if(!/^\S+@\S+\.\S+$/.test(email)){
//       emailMessage.textContent="❌ Please enter a valid email.";
//       emailMessage.style.color="red";
//       return;
//     }

//     try{
//       const res = await fetch("/send-results",{
//         method:"POST",
//         headers:{"Content-Type":"application/json"},
//         body: JSON.stringify({ email, score: answers.reduce((a,b)=>a+b,0), testType })
//       });
//       const data = await res.json();
//       if(data.success){
//         emailMessage.textContent="✅ Your results have been sent!";
//         emailMessage.style.color="green";
//         emailForm.reset();
//       } else {
//         throw new Error(data.message || "Server error");
//       }
//     }catch(err){
//       console.error(err);
//       emailMessage.textContent="❌ Failed to send results. Try again.";
//       emailMessage.style.color="red";
//     }
//   });
// }

function showResult(){
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.innerHTML = `
    <h2>Your results are in</h2>
    <p>Your result is ready. We’ll send it to you by email so only you can see it.</p>
    <form id="emailForm">
      <input type="email" id="emailInput" placeholder="Enter your email" required />
      <button type="submit" class="btn">Submit</button>
    </form>
    <p id="emailMessage"></p>
  `;

  const emailForm = document.getElementById("emailForm");
  const emailInput = document.getElementById("emailInput");
  const emailMessage = document.getElementById("emailMessage");

 emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    emailMessage.textContent = "❌ Please enter a valid email.";
    emailMessage.style.color = "red";
    return;
  }

  // Step 1: create invoice
  emailMessage.textContent = "⏳ Creating payment invoice...";
  emailMessage.style.color = "black";

  
////////////////////////////
  try {
    const res = await fetch("/start-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: 1, // your price in MNT
        testType,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

// Step 2: show QR code popup
// Pick the first bank’s QR string
// Pick the QR string from the first bank link
const firstBankLink = data.urls[0].link; 
const qrString = decodeURIComponent(firstBankLink.split("qPay_QRcode=")[1]);

// Create popup container
const qrPopup = document.createElement("div");
qrPopup.className = "qr-popup";

qrPopup.innerHTML = `
  <div class="qr-box">
    <h3>💳 Pay with QPay</h3>
    <p>Scan this QR code using your bank app, or click an icon to open directly.</p>
    <div id="qrcode"></div>
    <p>Invoice ID: ${data.invoice_id}</p>
    <div id="bankLinks" class="bank-links"></div>
    <button id="cancelPay" class="btn-ghost">Cancel</button>
  </div>
`;

document.body.appendChild(qrPopup);

// Generate QR code
new QRCode(document.getElementById("qrcode"), {
  text: qrString,
  width: 250,
  height: 250,
  correctLevel: QRCode.CorrectLevel.H
});

// Populate bank icons
// Populate bank icons neatly
// Create bank icons container
const bankLinksDiv = document.createElement("div");
bankLinksDiv.id = "bankLinks";
bankLinksDiv.style.display = "grid";
bankLinksDiv.style.gridTemplateColumns = "repeat(auto-fit, minmax(60px, 1fr))";
bankLinksDiv.style.gap = "10px";
bankLinksDiv.style.justifyItems = "center";
bankLinksDiv.style.marginTop = "10px";
bankLinksDiv.style.maxHeight = "150px";   // max height, will scroll if overflow
bankLinksDiv.style.overflowY = "auto";
bankLinksDiv.style.padding = "5px";

// Populate the banks
data.urls.forEach(bank => {
  const a = document.createElement("a");
  a.href = bank.link;
  a.target = "_blank";
  a.title = bank.name;

  const img = document.createElement("img");
  img.src = bank.logo;
  img.alt = bank.name;
  img.style.width = "50px";
  img.style.height = "50px";
  img.style.borderRadius = "8px";
  img.style.cursor = "pointer";
  img.style.objectFit = "contain";
  img.style.transition = "transform 0.2s, box-shadow 0.2s";

  // Hover effect
  img.addEventListener("mouseenter", () => {
    img.style.transform = "scale(1.1)";
    img.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  });
  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
    img.style.boxShadow = "none";
  });

  a.appendChild(img);
  bankLinksDiv.appendChild(a);
});

// Add it below QR code
const qrBox = document.querySelector(".qr-box");
qrBox.appendChild(bankLinksDiv);

// Cancel button
document.getElementById("cancelPay").addEventListener("click", () => qrPopup.remove());

    // const qrPopup = document.createElement("div");
    // qrPopup.className = "qr-popup";
    // qrPopup.innerHTML = `
    //   <div class="qr-box">
    //     <h3>💳 Pay with QPay</h3>
    //     <p>Scan this QR code using your bank app.</p>
    //     <p>Invoice ID: ${data.invoice_id}</p>
    //     <button id="cancelPay" class="btn-ghost">Cancel</button>
    //   </div>
    // `;
    // document.body.appendChild(qrPopup);
    // const img = document.createElement("img");
    // img.src = data.qr_image;
    // img.alt = "QPay QR Code";
    // img.style.width = "250px"; // optional
    // qrPopup.querySelector(".qr-box").insertBefore(img, qrPopup.querySelector("#cancelPay"));
    
    // const cancelBtn = document.getElementById("cancelPay");
    // cancelBtn.addEventListener("click", () => qrPopup.remove());

    // Step 3: Poll every 5s to check payment
    const checkPayment = setInterval(async () => {
      const check = await fetch(`/check-payment`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
          invoice_id: data.invoice_id,
          email,
          score: answers.reduce((a, b) => a + b, 0),
          testType, }),
});

      const status = await check.json();

      if (status.paid) {
        clearInterval(checkPayment);
        qrPopup.remove();
        emailMessage.textContent = "✅ Payment confirmed! Sending your results...";
        emailMessage.style.color = "green";

        // Step 4: Send results after payment
        // const send = await fetch("/send-results", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     email,
        //     score: answers.reduce((a, b) => a + b, 0),
        //     testType,
        //   }),
        // });

        // const result = await send.json();
        // if (result.success) {
        //   emailMessage.textContent = "🎉 Your results have been sent!";
        // } else {
        //   emailMessage.textContent = "❌ Payment ok, but failed to send email.";
        // }
      }
    }, 5000);
  } catch (err) {
    console.error(err);
    emailMessage.textContent = "❌ Failed to create payment. Try again.";
    emailMessage.style.color = "red";
  }
});

}



































