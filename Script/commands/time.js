const moment = require("moment-timezone");

module.exports.config = {
  name: "time",
  version: "4.3.0",
  hasPermssion: 0,
  credits: "Mohammad Akash + Saiful Edit",
  description: "Displays current time, Bangla date, bot uptime, and important days.",
  commandCategory: "Info",
  cooldowns: 1
};

// 🔹 ইংরেজি সংখ্যা -> বাংলা সংখ্যা
function engToBanglaNumber(number) {
  const eng = ["0","1","2","3","4","5","6","7","8","9"];
  const ban = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  let str = number.toString();
  for (let i = 0; i < eng.length; i++) {
    str = str.replace(new RegExp(eng[i], "g"), ban[i]);
  }
  return str;
}

// 🔹 বাংলা মাস
const banglaMonths = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

// 🔹 বাংলা বার
const banglaWeekdays = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার",
  "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

// 🔹 বাংলা মাস শুরু (ইংরেজি মাস অনুযায়ী)
const banglaMonthStart = [
  [3,14], // বৈশাখ - এপ্রিল 14
  [4,15], // জ্যৈষ্ঠ - মে 15
  [5,15], // আষাঢ় - জুন 15
  [6,16], // শ্রাবণ - জুলাই 16
  [7,17], // ভাদ্র - আগস্ট 17
  [8,17], // আশ্বিন - সেপ্টেম্বর 17
  [9,17], // কার্তিক - অক্টোবর 17
  [10,16],// অগ্রহায়ণ - নভেম্বর 16
  [11,16],// পৌষ - ডিসেম্বর 16
  [0,15], // মাঘ - জানুয়ারি 15
  [1,13], // ফাল্গুন - ফেব্রুয়ারি 13/14
  [2,15]  // চৈত্র - মার্চ 15
];

// 🔹 গুরুত্বপূর্ণ দিন
const importantDays = [
  { name: "শুক্রবার", check: (date) => date.day() === 5 },
  { name: "ঈদুল ফিতর", check: (date) => date.format("MM-DD") === "04-21" }, // উদাহরণ
  { name: "ঈদুল আযহা", check: (date) => date.format("MM-DD") === "06-28" },
  { name: "মাহে রমজান শুরু", check: (date) => date.format("MM-DD") === "03-11" },
  { name: "মাহে রমজান শেষ", check: (date) => date.format("MM-DD") === "04-10" }
];

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // আপটাইম
  const uptime = process.uptime(),
    hours = Math.floor(uptime / 3600),
    minutes = Math.floor((uptime % 3600) / 60),
    seconds = Math.floor(uptime % 60);

  // বর্তমান সময় (Dhaka)
  const now = moment.tz("Asia/Dhaka");
  const time = now.format("hh:mm A");
  const date = now.format("DD-MM-YYYY, dddd");

  // ইংরেজি তারিখ
  const engDate = now.date();
  const engMonth = now.month(); // 0–11
  const engYear = now.year();

  // বাংলা বছর
  let banglaYear = engYear - 593;
  if (engMonth < 3 || (engMonth === 3 && engDate < 14)) banglaYear -= 1;

  // বাংলা মাস নির্ধারণ
  let banglaMonth = 11; // ডিফল্ট চৈত্র
  for (let i = 0; i < 12; i++) {
    let [m, d] = banglaMonthStart[i];
    if ((engMonth > m) || (engMonth === m && engDate >= d)) banglaMonth = i;
  }

  // বাংলা দিনের হিসাব
  let [startMonth, startDate] = banglaMonthStart[banglaMonth];
  let start = moment(`${engYear}-${startMonth+1}-${startDate}`, "YYYY-M-D").tz("Asia/Dhaka");
  let banglaDay = now.diff(start, "days") + 1;

  // ফাল্গুন লিপ ইয়ার চেক
  if (banglaMonth === 10) { // ফাল্গুন
    const isLeap = ((engYear % 400 === 0) || (engYear % 4 === 0 && engYear % 100 !== 0));
    if (isLeap && banglaDay > 29) banglaDay = 30;
  }

  const banglaDate = `${engToBanglaNumber(banglaDay)} ${banglaMonths[banglaMonth]}, ${engToBanglaNumber(banglaYear)} (${banglaWeekdays[now.day()]})`;

  // আজকের গুরুত্বপূর্ণ দিন
  let todayImportant = importantDays.filter(d => d.check(now)).map(d => d.name).join(", ");
  if (!todayImportant) todayImportant = "কোনও বিশেষ দিন নেই";

  // কেপশন
  const caption = `
🌟 আল্লাহর আশীর্বাদ সর্বদা আপনার সাথে থাকুক..!
🕌 নামাজ নিয়মিত পড়ুন..!
🌙 দোয়া করতে ভুলবেন না..!
🤝 মানুষের সাথে সদয় থাকুন..!
💫 জীবন আলোকিত ও বরকতপূর্ণ হোক..!`;

  // ফাইনাল মেসেজ
  const message = 
`╔═══════════════╗
   📅 𝙲𝚊𝚕𝚎𝚗𝚍𝚎𝚛 📅
╚═══════════════╝
🕒 সময়        : ${time}
📅 তারিখ      : ${date}
🗓️ বাংলা তারিখ : ${banglaDate}
🗓️ আজকের বিশেষ দিন : ${todayImportant}
⏳ আপটাইম     : ${engToBanglaNumber(hours)} ঘন্টা, ${engToBanglaNumber(minutes)} মিনিট, ${engToBanglaNumber(seconds)} সেকেন্ড

━━━━━━━━━━━━━━━━━━━━
${caption}
━━━━━━━━━━━━━━━━━━━━

👑 Bot Owner : 🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

  return api.sendMessage(message, threadID);
};
