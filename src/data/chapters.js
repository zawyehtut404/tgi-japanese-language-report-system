export const MINNA_TASKS = ["言葉", "文法", "練習 A", "文型", "会話", "練習 B", "練習 C", "問題"];
export const N5_CHAPTERS = Array.from({ length: 25 }, (_, i) => i + 1);
export const KANJI_CHAPTERS = Array.from({ length: 15 }, (_, i) => i + 1);

// --- N3 Data Start ---

export const N3_GOI_P1 = Array.from({ length: 21 }, (_, i) => i + 1);
export const N3_GOI_P2 = Array.from({ length: 8 }, (_, i) => i + 1);
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

export const N3_DOKKAI = Array.from({ length: 42 }, (_, i) => `問題 ${i + 1}`);

export const N3_PAST_PAPERS = [
  { year: "Year-1", month: "Month-1", tasks: ["1.文字語彙", "2.文法、読解", "3.聴解"] },
  { year: "Year-2", month: "Month-2", tasks: ["1.文字語彙", "2.文法、読解", "3.聴解"] },
  { year: "Year-3", month: "Month-3", tasks: ["1.文字語彙", "2.文法、読解", "3.聴解"] },
  { year: "Year-4", month: "Month-4", tasks: ["1.文字語彙", "2.文法、読解", "3.聴解"] },
  { year: "Year-5", month: "Month-5", tasks: ["1.文字語彙", "2.文法、読解", "3.聴解"] }
];

// --- N3 Data End ---

export const TIME_SLOTS = {
  "Mon-Thur": ["9:30 ~ 11:15", "1:00 ~ 2:45", "3:00 ~ 4:45"],
  "Sat-Sun": ["9:30 ~ 12:00", "2:00 ~ 4:30"]
};