const moment = require("moment-timezone");

module.exports.config = {
  name: "autotime",
  version: "6.0.0",
  hasPermssion: 2,
  credits: "ALVI + Saiful Edit + GPT",
  description: "বট চালু হলেই প্রতি ঘন্টা সময়, বাংলা তারিখ ও দোয়া পাঠাবে",
  commandCategory: "system",
  usages: "autotime",
  cooldowns: 5,
};

const runningGroups = new Set();

// বাংলা মাস ও বার
const banglaMonths = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

const banglaWeekdays = [
  "রবিবার", "সোমবার", "মঙ্গলবার",
  "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];

// ইংরেজি সংখ্যা বাংলায় রূপান্তর
function toBanglaNumber(num) {
  return num.toString().replace(/\d/g, d => banglaDigits[d]);
}

// বাংলা ক্যালেন্ডার কনভার্সন
function getBanglaDateTime(now) {
  // গ্রেগরিয়ান তারিখ
  const gDay = now.date();
  const gMonth = now.month() + 1; // 1-12
  const gYear = now.year();

  // বাংলা সাল হিসাব (পূর্ণতা প্রায়, Pohela Boishakh 기준)
  let banglaYear = gYear - 593;
  let banglaMonth = "";
  let banglaDay = 0;

  // বাংলা মাস ও দিনের হিসাব (simplified, সঠিকতা প্রায়)
  const banglaMonthStart = [
    { month: 4, day: 14, banglaMonth: "বৈশাখ" },
    { month: 5, day: 15, banglaMonth: "জ্যৈষ্ঠ" },
    { month: 6, day: 15, banglaMonth: "আষাঢ়" },
    { month: 7, day: 16, banglaMonth: "শ্রাবণ" },
    { month: 8, day: 16, banglaMonth: "ভাদ্র" },
    { month: 9, day: 16, banglaMonth: "আশ্বিন" },
    { month: 10, day: 16, banglaMonth: "কার্তিক" },
    { month: 11, day: 15, banglaMonth: "অগ্রহায়ণ" },
    { month: 12, day: 15, banglaMonth: "পৌষ" },
    { month: 1, day: 14, banglaMonth: "মাঘ" },
    { month: 2, day: 13, banglaMonth: "ফাল্গুন" },
    { month: 3, day: 14, banglaMonth: "চৈত্র" },
  ];

  for (let i = banglaMonthStart.length - 1; i >= 0; i--) {
    const start = banglaMonthStart[i];
    if (gMonth > start.month || (gMonth === start.month && gDay >= start.day)) {
      banglaMonth = start.banglaMonth;
      banglaDay = gDay - start.day + 1;
      if (banglaMonth === "বৈশাখ" && gMonth < 4) {
        banglaYear--; // নতুন বাংলা বছর শুরু
      }
      break;
    }
  }

  // যদি কোনো মাস না মিলে, চৈত্র ধরে নাও
  if (!banglaMonth) {
    banglaMonth = "চৈত্র";
    banglaDay = gDay + 17; // approx
  }

  // বাংলা দিন
  const weekday = banglaWeekdays[now.day()];

  return {
    day: toBanglaNumber(banglaDay),
    month: banglaMonth,
    year: toBanglaNumber(banglaYear),
    weekday
  };
}

function sendTime(api, threadID) {
  if (!runningGroups.has(threadID)) return;

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const time = now.format("hh:mm A");
  const date = now.format("DD/MM/YYYY, dddd");
  const bangla = getBanglaDateTime(now);

  const msg = `
╔═❖═❖═❖═❖═❖═❖═╗
 ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
╚═❖═❖═❖═❖═❖═❖═╝
   ╔═✪═🕒═✪═╗
   সময়: ${time}
   ╚════════╝
📅 ইংরেজি তারিখ: ${date}
🗓️ বাংলা তারিখ: ${bangla.day} ${bangla.month}, ${bangla.year} (${bangla.weekday})
🌍 টাইমজোন: ${timeZone}
━━━━━━━━━━━━━━━━━━━━
✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..! 
🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..!
🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..!
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟
`;

  api.sendMessage(msg, threadID);
}

// রানার ফাংশন একই থাকবে
module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  if (runningGroups.has(threadID)) {
    return api.sendMessage("⏰ এই গ্রুপে ইতিমধ্যে AutoTime চলছে!", threadID);
  }

  runningGroups.add(threadID);
  api.sendMessage("✅ বট চালু হয়েছে। এখন থেকে প্রতি ঘন্টা সময়, তারিখ ও দোয়া পাঠানো হবে।", threadID);

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const nextHour = now.clone().add(1, "hour").startOf("hour");
  let delay = nextHour.diff(now);

  setTimeout(function tick() {
    if (!runningGroups.has(threadID)) return;

    sendTime(api, threadID);

    setInterval(() => {
      if (!runningGroups.has(threadID)) return;
      sendTime(api, threadID);
    }, 60 * 60 * 1000);

  }, delay);
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;

  if (!runningGroups.has(threadID)) {
    runningGroups.add(threadID);

    const timeZone = "Asia/Dhaka";
    const now = moment().tz(timeZone);
    const nextHour = now.clone().add(1, "hour").startOf("hour");
    let delay = nextHour.diff(now);

    setTimeout(function tick() {
      if (!runningGroups.has(threadID)) return;

      sendTime(api, threadID);

      setInterval(() => {
        if (!runningGroups.has(threadID)) return;
        sendTime(api, threadID);
      }, 60 * 60 * 1000);

    }, delay);
  }
};
