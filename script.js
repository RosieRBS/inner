// ---------------------------
// DOM references
// ---------------------------
const startTest1Btn = document.getElementById("startTest1");
const startTest2Btn = document.getElementById("startTest2");
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

// ---------------------------
// Quiz data: Sections
// Each test has 3 sections, 10 questions each
// ---------------------------
const sectionsTest1 = [
  {
    title: "I хэсэг: Бусдыг хянах, удирдах хандлага",
    description: "...",
    questions: [
      { text: "1. Та бусдын шийдвэрт хэт их нөлөөлөх эсвэл өөрийн хүслээр удирдахыг оролддог уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "2. Бусдын алдаа дутагдлыг шууд шүүмжилж, тэднийг доош нь хийдэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "3. Та харилцаандаа хяналт тавьж, бусдыг өөрийнхөө үгэнд оруулахыг хичээдэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "4. Таны хувьд бусад хүмүүс таны үгэнд орох ёстой гэсэн бодол байнга төрдөг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "5. Та бусдаас өөрийн ашиг сонирхлын үүднээс давуу байдлыг эрэлхийлдэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "6. Та бусдын санаа бодлыг үл тоомсорлож, өөрийнхөө санааг л чухалчилдаг уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "7. Та бусдыг сэтгэл санааны хувьд дарамталж, өөртөө наах хандлагатай юу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "8. Та өөрийн үйлдлийн хариуцлагыг бусдад хүлээлгэдэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "9. Та бусдын амжилтыг үл тоомсорлож, өөрийнхөө амжилтыг дөвийлгөдөг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "10. Та бусдын хувийн орон зай, эрх чөлөөнд хүндэтгэлгүй ханддаг уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      }
    ]
  },
  {
    title: "II хэсэг: Сөрөг харилцаа ба үл итгэлцэл",
    description: "...",
    questions: [
      { text: "11. Та бусдыг байнга буруутгаж, гомдоллох хандлагатай юу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "12. Та бусдын сэтгэл санааг унагах эсвэл өөртөө эргэлзэхэд хүргэдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "13. Та бусдын нууцыг дэлгэх эсвэл хов жив тараах хандлагатай юу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "14. Та шударга бусаар өрсөлдөж, бусдыг хохироож өөрийн зорилгод хүрдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "15. Таны уур бухимдал гэнэт оргилж, хяналтаас гардаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "16. Та бусдад итгэхээс зайлсхийж, үргэлж сэжиглэдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "17. Та маргаантай үед буулт хийхээс татгалзаж, зөвхөн өөрийнхөөрөө зүтгэдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "18. Та уучлалт гуйх нь сул доройн шинж гэж үздэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "19. Та бусдын мэдрэмжийг үл тоомсорлож, эмпатигүй ханддаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "20. Таны сэтгэл хөдлөл тогтворгүй байж, ойр орчныхоо хүмүүст нөлөөлдөг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] }
    ]
  },
  {
    title: "III хэсэг: Хувийн өөрийгөө үнэлэх үнэлэмж ба хариуцлагагүй байдал",
    description: "...",
    questions: [
      { text: "21. Та өөрийгөө хэт өндрөөр үнэлж, бусдаас давуу гэж боддог уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "22. Та өөрийн алдаа дутагдлыг нууж, хүлээн зөвшөөрөхөөс татгалздаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "23. Та амлалтаа биелүүлэхгүй байх, эсвэл хариуцлагаас зайлсхийх хандлагатай юу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "24. Та өөрийгөө хохирогч болгож, бусдаас анхаарал хайрладаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "25. Та бусдын хил хязгаарыг давж, тэдний хүсээгүй зүйлийг хийхийг шаарддаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "26. Та шаардлагатай үед тусламж авахаас татгалзаж, өөрийгөө хэт тусгаарладаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "27. Та сөрөг сэтгэл хөдлөлөө удирдах чадваргүй байдаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "28. Та бусдыг манипуляци хийж, өөрийнхөө хүслийг биелүүлдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "29. Та бусдын амжилтад атаархаж, тэднийг доош нь хийхийг оролддог уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "30. Таны харилцаа тогтворгүй байж, олон удаа хүмүүстэй муудалцдаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] }
    ]
  }
];
const sectionsTest2 = [
  {
    title: "I хэсэг: Сэтгэлзүйн болон мэдрэмжийн шинж тэмдэг",
    description: "...",
    questions: [
      { text: "1. Та сэтгэл түгших, санаа зовох мэдрэмжийг байнга мэдэрдэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "2. Та уур уцаартай, амархан бухимддаг болсон уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "3. Та гунигтай, сэтгэлээр унасан байдалтай байх нь ихэсчихсэн үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "4. Та төвлөрөхөд хүндрэлтэй болсон уу, эсвэл мартамхай болсон уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "5. Та өөрийгөө буруутгах эсвэл ирээдүйдээ санаа зовох хандлагатай юу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "6. Та шинэ зүйлд сонирхолгүй болсон уу, эсвэл дуртай зүйлсээ хийхээ больсон уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "7. Та амархан уйлж, сэтгэл хөдлөлдөө хяналт тавьж чадахгүй байх тохиолдол ихэсчихсэн үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "8. Та бусадтай харилцахаас зайлсхийх, эсвэл ганцаардахыг илүүд үздэг үү?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "9. Та айдас, түгшүүрийн шалтгааныг тодорхойлж чадахгүй байх үе олон байдаг уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      },
      { text: "10. Та урам хугарах эсвэл найдваргүй мэдрэмжтэй байдаг уу?", 
        options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ]
      }
    ]
  },
  {
    title: "II хэсэг: Бие махбодийн шинж тэмдэг",
    description: "...",
    questions: [
      { text: "11. Та нойргүйдэлтэй эсвэл хэт их унтдаг болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "12. Таны хоолны дуршил өөрчлөгдсөн үү (хэт их идэх, эсвэл огт идэхгүй байх)?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "13. Таны гэдэс өвдөх, бөөлжих, суулгах эсвэл өтгөн хатах зэрэг хоол боловсруулах тогтолцооны асуудал үүссэн үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "14. Та толгой өвдөх, булчин чангарах, эсвэл биеэр хөндүүрлэх мэдрэмж байнга мэдэрдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "15. Та хурдан ядардаг, эсвэл эрчим хүчгүй болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "16. Таны зүрх дэлсэх, амьсгал давхцах зэрэг шинж тэмдэг илэрдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "17. Таны дархлаа суларч, амархан өвчилдөг болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "18. Таны арьс эсвэл үсэнд (жишээ нь, үс унах, тууралт гарах) өөрчлөлт гарсан уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "19. Таны биеийн жин гэнэт өөрчлөгдсөн үү (нэмэгдэх эсвэл буурах)?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "20. Та бэлгийн дур хүсэл буурсан уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] }
    ]
  },
  {
    title: "III хэсэг: Загвар, зан төлөвийн өөрчлөлт",
    description: "...",
    questions: [
      { text: "21. Та ажлын бүтээмж буурсан, эсвэл ажлаа хийхэд хүндрэлтэй болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "22. Та хорт зуршилд (архи, тамхи, мансууруулах бодис) автах эсвэл хэрэглээ нэмэгдсэн үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "23. Та бусадтай маргалдах, зөрчилдөх нь ихэсчихсэн үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "24. Та ороо бусгаа, эмх замбараагүй болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "25. Та хэт их зурагт үзэх, тоглоом тоглох зэрэг зүйлсээр стрессээ тайлахыг хичээдэг үү?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "26. Та эрсдэлтэй зан төлөв (жишээ нь, хурдан машин барих, мөрийтэй тоглох) гаргах хандлагатай юу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "27. Та ажлын хугацаа хоцрох эсвэл үүрэг хариуцлагаа үл тоомсорлох тохиолдол гардаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "28. Та өөрийн хувийн эрүүл ахуй, гадаад төрхөндөө анхаарахгүй байх тохиолдол гардаг уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "29. Та шинэ зүйл сурах, хөгжихөөс зайлсхийж, идэвхгүй болсон уу?", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] },
      { text: "30. Та амиа хорлох бодол эсвэл амьдрах сонирхолгүй байх мэдрэмж төрдөг үү? (Энэ нь маш ноцтой шинж тэмдэг тул яаралтай мэргэжлийн тусламж авах шаардлагатайг анхаарна уу!)", options: [
        { text: "Огт үгүй / Хэзээ ч үгүй", value: 1 },
        { text: "Ховорхон / Бараг үгүй", value: 2 },
        { text: "Заримдаа / Дунд зэрэг", value: 3 },
        { text: "Ихэвчлэн / Байнга", value: 4 },
        { text: "Үргэлж / Тийм ээ, яг тийм", value: 5 }
      ] }
    ]
  }
];

// ---------------------------
// State
// ---------------------------
let testType = "";
let sections = [];
let currentSection = 0;
let currentQuestion = 0;
let answers = [];
let score = 0;

// ---------------------------
// Start quiz handlers
// ---------------------------
startTest1Btn.addEventListener("click", () => {
  testType = "ТОКСИК ЗАН ТӨЛӨВИЙГ ТОДОРХОЙЛОХ ТЕСТ";
  sections = sectionsTest1;
  startQuiz();
});

startTest2Btn.addEventListener("click", () => {
  testType = "СТРЕССИЙГ ТОДОРХОЙЛОХ ТЕСТ";
  sections = sectionsTest2;
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

  emailForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = emailInput.value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){
      emailMessage.textContent="❌ Please enter a valid email.";
      emailMessage.style.color="red";
      return;
    }

    try{
      const res = await fetch("http://localhost:3000/send-results",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, score: answers.reduce((a,b)=>a+b,0), testType })
      });
      const data = await res.json();
      if(data.success){
        emailMessage.textContent="✅ Your results have been sent!";
        emailMessage.style.color="green";
        emailForm.reset();
      } else {
        throw new Error(data.message || "Server error");
      }
    }catch(err){
      console.error(err);
      emailMessage.textContent="❌ Failed to send results. Try again.";
      emailMessage.style.color="red";
    }
  });
}
