const axios = require("axios");
const moment = require("moment-timezone");
require("moment/locale/bn"); // বাংলা লোকেল

module.exports.config = {
  name: "autotime",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Saiful Islam × ChatGPT",
  description: "Auto Stylish Time (Bangla Hijri + 12H, Safe)",
  commandCategory: "Utility",
  cooldowns: 5
};

// বাংলা মাস লিস্ট
const banglaMonths = [
  "বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র","আশ্বিন",
  "কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র"
];

// বাংলা সপ্তাহের দিন
const banglaDays = [
  "রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"
];

// হিজরি মাস (বাংলা নাম)
const hijriMonthsBn = [
  "মুহররম","সফর","রবিউল আউয়াল","রবিউস সানি",
  "জমাদিউল আউয়াল","জমাদিউস সানি","রজব","শা'বান",
  "রমজান","শাওয়াল","জ্বিলকদ","জ্বিলহজ্জ"
];

async function getTimeMessage() {
  const dhakaTime = moment().tz("Asia/Dhaka");

  // ইংরেজি তারিখ + মাস
  const engDay = dhakaTime.format("DD");
  const engMonth = dhakaTime.format("MMMM");

  // বাংলা দিন/মাস
  const bnDay = dhakaTime.date();
  const bnMonth = banglaMonths[dhakaTime.month()];
  const weekDayBn = banglaDays[dhakaTime.day()];

  // সময় (12H AM/PM)
  const timeNow = dhakaTime.format("hh:mm A");

  // আজকের গ্রেগরিয়ান তারিখ
  const today = dhakaTime.format("DD-MM-YYYY");
  let hijriDay = "ডেটা পাওয়া যায়নি";
  let hijriMonthBn = "";

  try {
    const hijriRes = await axios.get(`http://api.aladhan.com/v1/gToH?date=${today}`);
    if (hijriRes.data?.data?.hijri) {
      const hijriData = hijriRes.data.data.hijri;
      hijriDay = hijriData.day;
      hijriMonthBn = hijriMonthsBn[parseInt(hijriData.month.number) - 1];
    }
  } catch (err) {
    // Error হলে শুধু সুন্দর fallback টেক্সট দেখাবে
    hijriDay = "ডেটা পাওয়া যায়নি";
    hijriMonthBn = "";
  }

  return `======= 𝗧𝗜𝗠𝗘 =======
📅 ইংরেজি তারিখ: ${engDay} 
🗒️ মাস : ${engMonth}
📛 দিন: ${weekDayBn}
🗓️ ${bnMonth}: ${bnDay} 
🕌 ${hijriMonthBn ? hijriMonthBn : "হিজরি"}: ${hijriDay}
🕒 সময়: ${timeNow}
━━━━━━━━━━━━━━━
আল্লাহ কে বেশি বেশি সরন করুন..! 
৫ ওয়াক্ত নামাজ পরুন..!
সবার সাথে ভালো বেবহার করুন..!
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦`;
}

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  // প্রথমবার কল
  const firstMessage = await getTimeMessage();
  api.sendMessage(firstMessage, threadID);

  // প্রতি ১ ঘন্টা পর
  setInterval(async () => {
    try {
      const message = await getTimeMessage();
      api.sendMessage(message, threadID);
    } catch (err) {
      console.error(err);
    }
  }, 3600000); // ১ ঘন্টা

  api.sendMessage("✅ Stylish Auto Time System Started!", threadID);
};
