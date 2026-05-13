export const MINNA_TASKS = ["言葉", "文法", "練習 A", "文型", "会話", "練習 B", "練習 C", "問題"];
export const N5_CHAPTERS = Array.from({ length: 25 }, (_, i) => i + 1);
export const KANJI_CHAPTERS = Array.from({ length: 15 }, (_, i) => i + 1);

// --- N3 Data Start ---

// N3_GOI_P1 ကို သင်တောင်းဆိုထားသည့်အတိုင်း Range အလိုက် အုပ်စုဖွဲ့ထားခြင်း
export const N3_GOI_P1 = [
  { range: "1 課 to 5 課", tasks: ["1課", "2課", "3課", "4課", "5課"] },
  { range: "6 課 to 10 課", tasks: ["6課", "7課", "8課", "9課", "10課"] },
  { range: "11 課 to 14 課", tasks: ["11課", "12課", "13課", "14課"] },
  { range: "15 課 to 19 課", tasks: ["15課", "16課", "17課", "18課", "19課"] },
  { range: "20 課 to 21 課", tasks: ["20課", "21課"] }
];

// N3_GOI_P2 ကို သင်တောင်းဆိုထားသည့်အတိုင်း Range အလိုက် အုပ်စုဖွဲ့ထားခြင်း
export const N3_GOI_P2 = [
  { range: "1章 to 2章", tasks: ["1章", "2章"] },
  { range: "3章 to 4章", tasks: ["3章", "4章"] },
  { range: "5章 to 6章", tasks: ["5章", "6章"] },
  { range: "7章 to 8章", tasks: ["7章", "8章"] }
];

export const GOI_TASKS = ["課", "練習"];

export const N3_CHOUKAI = [
  { name: "1章", tasks: ["1課", "2課", "3課", "4課", "5課"] },
  { name: "2章", tasks: ["1課", "2課", "3課", "4課", "5課", "6課"] },
  { name: "3章", tasks: ["1課", "2課", "3課", "4課", "5課", "6課"] },
  { name: "4章", tasks: ["1課", "2課", "3課", "4課", "5課"] },
  { name: "5章", tasks: ["1課"] }
];

export const N3_BUNPOU = [
  // Units 1 to 12
  { name: "1-2 Unit", tasks: ["1課", "2課", "1-2 練習"] },
  { name: "3-4 Unit", tasks: ["3課", "4課", "3-4 練習"] },
  { name: "5-6 Unit", tasks: ["5課", "6課", "5-6 練習"] },
  { name: "7-8 Unit", tasks: ["7課", "8課", "7-8 練習"] },
  { name: "9-10 Unit", tasks: ["9課", "10課", "9-10 練習"] },
  { name: "11-12 Unit", tasks: ["11課", "12課", "11-12 練習"] },
  
  // A to E Section
  { name: "A Unit", tasks: ["A", "練習"] },
  { name: "B Unit", tasks: ["B", "練習"] },
  { name: "C Unit", tasks: ["C", "練習"] },
  { name: "D Unit", tasks: ["D", "練習"] },
  { name: "E Unit", tasks: ["E", "練習"] },
  { name: "A-E Review", tasks: ["A to E", "練習"] },
  
  // F to J Section
  { name: "F Unit", tasks: ["F", "練習"] },
  { name: "G Unit", tasks: ["G", "練習"] },
  { name: "H Unit", tasks: ["H", "練習"] },
  { name: "I Unit", tasks: ["I", "練習"] },
  { name: "J Unit", tasks: ["J", "練習"] },
  { name: "A-J Review", tasks: ["A to J", "練習"] }
];

export const N3_DOKKAI = Array.from({ length: 64 }, (_, i) => `問題 ${i + 1}`);

export const N3_PAST_PAPERS = [
  { year: "2025年", month: "7月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2025年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2024年", month: "7月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2024年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2023年", month: "7月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2023年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2022年", month: "7月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2022年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2021年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
  { year: "2021年", month: "12月", tasks: ["1.文字語彙", "2.文法・読解", "3.聴解"] },
];

// --- N3 Data End ---

export const TIME_SLOTS = {
  "Mon-Thur": ["9:30 ~ 11:15", "1:00 ~ 2:45", "3:00 ~ 4:45"],
  "Sat-Sun": ["9:30 ~ 12:00", "2:00 ~ 4:30"]
};