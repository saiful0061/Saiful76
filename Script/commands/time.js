const moment = require("moment-timezone");
const { BanglaDate } = require("bangla-calendar"); // 🔹 বাংলা তারিখ কনভার্টার

module.exports.config = {
  name: "time",
  version: "4.0.0",
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

  // 🔹 বাংলা তারিখ (লাইব্রেরি ব্যবহার করে)
  const bd = new BanglaDate(now.toDate());
  const banglaDay = engToBanglaNumber(bd.getDate());
  const banglaMonth = bd.getMonthName();
  const banglaYear = engToBanglaNumber(bd.getYear());
  const banglaWeekday = bd.getDayName();

  const banglaDate = `${banglaDay} ${banglaMonth}, ${banglaYear} (${banglaWeekday})`;

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
