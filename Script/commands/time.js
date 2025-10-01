const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "time",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash + Saiful Edit",
  description: "Displays current time and bot runtime with caption and owner mention.",
  commandCategory: "Info",
  cooldowns: 1,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // বটের আপটাইম
  const uptime = process.uptime(),
    hours = Math.floor(uptime / 3600),
    minutes = Math.floor((uptime % 3600) / 60),
    seconds = Math.floor(uptime % 60);

  // ঢাকার সময়
  const now = moment.tz("Asia/Dhaka");
  const time = now.format("hh:mm A");
  const date = now.format("DD-MM-YYYY, dddd");

  // বাংলা তারিখ (ডেমো)
  const banglaDate = "১৬ আশ্বিন, ১৪৩২ (রবিবার)";

  // Owner Info
  const ownerID = "100078049308655";
  let ownerName = "🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟";

  // কেপশন
  const caption = `
🌟 আল্লাহর আশীর্বাদ সর্বদা আপনার সাথে থাকুক..!
🕌 নামাজ নিয়মিত পড়ুন..!
🌙 দোয়া করতে ভুলবেন না..!
🤝 মানুষের সাথে সদয় থাকুন..!
💫 জীবন আলোকিত ও বরকতপূর্ণ হোক..!
`;

  // ফাইনাল মেসেজ
  const message = 
`╔══════════════════════╗
        ❮ 𝙲𝚊𝚕𝚎𝚗𝚍𝚎𝚛 ❯
╚══════════════════════╝

🕒 𝗧𝗶𝗺𝗲       : ${time}
📅 𝗗𝗮𝘁𝗲       : ${date}
🗓️ বাংলা তারিখ : ${banglaDate}
⏳ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲 : ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)

━━━━━━━━━━━━━━━━━━━━
${caption}
━━━━━━━━━━━━━━━━━━━━

👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : ${ownerName}`;

  return api.sendMessage(message, threadID);
};
