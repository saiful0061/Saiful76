const moment = require("moment-timezone");

module.exports.config = {
  name: "time",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Mohammad Akash + Saiful Edit",
  description: "Displays current time, Bangla date and bot runtime with caption.",
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

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // আপটাইম
  const uptime = process.uptime(),
    hours = Math.floor(uptime / 3600),
    minutes = Math.floor((uptime % 3600) / 60),
    seconds = Math.floor(uptime % 60);

  // বর্তমান সময়
  const now = moment.tz("Asia/Dhaka");
  const time = now.format("hh:mm A");
  const date = now.format("DD-MM-YYYY, dddd");

  // 🔹 বাংলা তারিখ ক্যালকুলেশন (Lite system)
  const engDate = now.date();
  const engMonth = now.month(); 
  const engYear = now.year();

  let banglaDay = engDate - 13;
  let banglaMonth = engMonth;
  let banglaYear = engYear - 593;

  if (banglaDay <= 0) {
    banglaMonth -= 1;
    if (banglaMonth < 0) {
      banglaMonth = 11;
      banglaYear -= 1;
    }
    const monthDays = [31,31,31,31,31,30,30,30,30,30,30,30];
    banglaDay = monthDays[banglaMonth] + banglaDay;
  }

  const banglaDate = `${engToBanglaNumber(banglaDay)} ${banglaMonths[banglaMonth]}, ${engToBanglaNumber(banglaYear)} (${banglaWeekdays[now.day()]})`;

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
⏳ আপটাইম     : ${engToBanglaNumber(hours)} ঘন্টা, ${engToBanglaNumber(minutes)} মিনিট, ${engToBanglaNumber(seconds)} সেকেন্ড

━━━━━━━━━━━━━━━━━━━━
${caption}
━━━━━━━━━━━━━━━━━━━━

👑 Bot Owner : 🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

  return api.sendMessage(message, threadID);
};
