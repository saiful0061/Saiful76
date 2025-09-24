const axios = require("axios");
const moment = require("moment-timezone");
require("moment/locale/bn");

module.exports.config = {
  name: "autotime",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Saif × Modified by Mohammad Akash",
  description: "Auto Stylish Time with English, Bangla & Hijri (All Groups, Auto Start)",
  commandCategory: "Utility",
  cooldowns: 5
};

const banglaMonths = [
  "বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র","আশ্বিন",
  "কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র"
];

const weekDays = [
  "রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"
];

async function sendAutoTime(api) {
  try {
    const now = moment().tz("Asia/Dhaka");

    // ইংরেজি
    const engDate = now.format("D MMMM");
    const engDay = weekDays[now.day()];
    const engTime = now.format("hh:mm A");

    // বাংলা
    const bnDay = now.date();
    const bnMonth = banglaMonths[now.month()]; 

    // হিজরি
    let hijriDay, hijriMonth, hijriYear;
    try {
      const today = now.format("DD-MM-YYYY");
      const hijriRes = await axios.get(`http://api.aladhan.com/v1/gToH?date=${today}`);
      if (hijriRes.data?.data?.hijri) {
        const hijriData = hijriRes.data.data.hijri;
        hijriDay = hijriData.day;
        hijriMonth = hijriData.month.ar;
        hijriYear = hijriData.year;
      } else {
        hijriDay = hijriMonth = hijriYear = "N/A";
      }
    } catch {
      hijriDay = hijriMonth = hijriYear = "Error";
    }

    const message = `╔═❖═❖═❖═❖═❖═❖═╗
    ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
╚═❖═❖═❖═❖═❖═❖═╝
         ╔═✪═🕒═✪═╗
          সময় : ${engTime}
         ╚════════╝
📅  ইংরেজি তারিখ : ${engDate}
📛  দিন  : ${engDay}
🗓  বাংলা মাস : ${bnMonth} ${bnDay}
🕌  হিজরি  : ${hijriDay} ${hijriMonth} ${hijriYear}
━━━━━━━━━━━━━━━━━━━━
✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..! 
🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..!
🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..!
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

    const threads = global.data.allThreadID || [];
    for (const thread of threads) {
      api.sendMessage(message, thread);
    }

  } catch (err) {
    console.error(err);
  }
}

module.exports.onLoad = function ({ api }) {
  console.log("✅ Stylish Auto Time Started (All Groups)");
  // প্রথমবার চালুর সাথে সাথেই মেসেজ পাঠাবে
  sendAutoTime(api);
  // প্রতি ১ ঘন্টা পর মেসেজ পাঠাবে
  setInterval(() => sendAutoTime(api), 3600000);
};
