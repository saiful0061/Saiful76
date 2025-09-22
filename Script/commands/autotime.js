const axios = require("axios");
const moment = require("moment-timezone");
require("moment/locale/bn"); // বাংলা লোকেল

module.exports.config = {
  name: "autotime",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Saif",
  description: "auto time",
  commandCategory: "Utility",
  cooldowns: 5
};

// আরবি মাস লিস্ট
const arabicMonths = [
  "মুহাররম",
  "সফর",
  "রবিউল আউয়াল",
  "রবিউস সানি",
  "জমাদিউল আউয়াল",
  "জমাদিউস সানি",
  "রজব",
  "শাবান",
  "রমজান",
  "শাওয়াল",
  "জিলকদ",
  "জিলহজ্জ"
];

// বাংলা মাস লিস্ট
const banglaMonths = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র"
];

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  // প্রতি ১ ঘন্টা পর আপডেট দেবে
  setInterval(async () => {
    try {
      // ইংরেজি তারিখ
      const engDate = moment().tz("Asia/Dhaka").format("D MMMM YYYY");
      const engTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

      // বাংলা তারিখ
      const bnDay = moment().tz("Asia/Dhaka").date();
      const bnMonth = banglaMonths[moment().tz("Asia/Dhaka").month()];
      const bnYear = moment().tz("Asia/Dhaka").year();
      const bnTime = moment().tz("Asia/Dhaka").locale("bn").format("hh:mm:ss A");

      // আরবি তারিখ (প্রায় হিসাব, Hijri API ব্যবহার করলে একদম সঠিক আসবে)
      const hijriDay = moment().tz("Asia/Dhaka").date();
      const hijriMonth = arabicMonths[moment().tz("Asia/Dhaka").month()];
      const hijriYear = moment().tz("Asia/Dhaka").year() - 579; // Approx Hijri year

      const message = `🕌 সময় আপডেট (প্রতি ১ ঘন্টা)

📅 ইংরেজি তারিখ: ${engDate}
⏰ সময়: ${engTime}

📅 বাংলা তারিখ: ${bnDay} ${bnMonth} ${bnYear}
⏰ সময়: ${bnTime}

📅 আরবি তারিখ: ${hijriDay} ${hijriMonth} ${hijriYear} হিজরি

🌸 আল্লাহকে বেশি বেশি স্মরণ করুন 🌸`;

      api.sendMessage(message, threadID);

    } catch (err) {
      console.error(err);
    }
  }, 3600000); // ১ ঘন্টা = 3600000 ms

  api.sendMessage("✅ Auto Time System", threadID);
};
