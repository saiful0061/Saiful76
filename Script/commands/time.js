const moment = require("moment-timezone");
require("moment/locale/bn");
require("moment-hijri");

module.exports.config = {
  name: "timeck",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Helal",
  description: "Show current time & date (English, Bangla, Hijri)",
  commandCategory: "utility",
  usages: "/timeck",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  let now = moment().tz("Asia/Dhaka");

  // ইংরেজি তারিখ
  let engDate = now.locale("en").format("D MMMM YYYY");
  let weekDay = now.locale("en").format("dddd");

  // বাংলা মাস
  const banglaMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
    "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
  ];
  let banglaDay = now.date();
  let banglaMonthIndex = (now.month() + 8) % 12;
  let banglaMonth = banglaMonths[banglaMonthIndex];

  // হিজরি তারিখ
  let hDay = now.iDate();
  let hMonthIndex = now.iMonth();
  const hijriMonths = [
    "মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি",
    "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শা‘বান",
    "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ্জ"
  ];
  let hMonth = hijriMonths[hMonthIndex] || "N/A";
  let hYear = now.iYear();

  // সময়
  let timeNow = now.format("hh:mm A");

  let message = 
`╔═❖═❖═❖═❖═❖═❖═╗
  ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
 ╚═❖═❖═❖═❖═❖═❖═╝
    ╔═✪═🕒═✪═╗
       ${timeNow}
    ╚════════╝
📅 English: ${engDate}
📛 Day: ${weekDay}
🗓️ বাংলা: ${banglaDay} ${banglaMonth}
🕌 Hijri: ${hDay} ${hMonth} ${hYear}
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
