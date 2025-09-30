const moment = require("moment-timezone");

module.exports.config = {
  name: "autotime",
  version: "5.0.0",
  hasPermssion: 2,
  credits: "ALVI + Saiful Edit",
  description: "বট চালু হলেই প্রতি ঘন্টা সময়, বাংলা তারিখ ও দোয়া পাঠাবে",
  commandCategory: "system",
  usages: "autotime",
  cooldowns: 5,
};

const runningGroups = new Set();

// বাংলা মাস ও বার ম্যানুয়ালি সেট
const banglaMonths = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
];

const banglaWeekdays = [
  "রবিবার", "সোমবার", "মঙ্গলবার",
  "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

// বাংলা তারিখ কনভার্টার
function toBanglaDate(dateObj) {
  const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return dateObj.toString().replace(/\d/g, d => banglaDigits[d]);
}

function getBanglaDate(now) {
  // Approximate Bangla calendar (not 100% accurate, simple conversion)
  const gDate = now.date();
  const gMonth = now.month(); // 0-11
  const gYear = now.year();

  // বাংলা সাল (approx, গ্রেগরিয়ান সাল - 593)
  const banglaYear = gYear - 593;

  // বাংলা মাস গাণিতিকভাবে ম্যাপ করা (সিম্পল, নিখুঁত না)
  const banglaMonth = banglaMonths[gMonth % 12];

  // বাংলা দিন
  const banglaDay = gDate;

  const weekday = banglaWeekdays[now.day()];

  return `${toBanglaDate(banglaDay)} ${banglaMonth}, ${toBanglaDate(banglaYear)} (${weekday})`;
}

function sendTime(api, threadID) {
  if (!runningGroups.has(threadID)) return;

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const time = now.format("hh:mm A");
  const date = now.format("DD/MM/YYYY, dddd");
  const banglaDate = getBanglaDate(now);

  const msg = `
  ╔═❖═❖═❖═❖═❖═❖═╗
   ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
  ╚═❖═❖═❖═❖═❖═❖═╝
     ╔═✪═🕒═✪═╗
     সময়: ${time}
     ╚════════╝
📅 ইংরেজি তারিখ: ${date}
🗓️ বাংলা তারিখ: ${banglaDate}
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
