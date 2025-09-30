// azan.js
// Auto Azan notification in ALL groups (Dynamic time version, Dohar Location)
// File: modules/commands/azan.js

const schedule = require("node-schedule");
const { PrayerTimes, CalculationMethod, Madhab, Coordinates } = require("adhan");

module.exports.config = {
  name: "azan",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "Akash + Saiful Edit",
  description: "প্রতিদিন আজান ও নামাজের সময় সব গ্রুপে অটো নোটিফিকেশন পাঠাবে (Dynamic, Dohar)",
  commandCategory: "Islamic",
  usages: "অটো রান",
  cooldowns: 5
};

let jobs = [];

// ✅ দোহার, ঢাকা লোকেশন
const coordinates = new Coordinates(23.5931, 90.1425);
const params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Hanafi;

module.exports.onLoad = async function({ api }) {

  function scheduleForToday() {
    const date = new Date();
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const times = {
      "তাহাজ্জুদ": { time: prayerTimes.fajr, offset: -120, msg: 
`╔═❖🌌❖═╗
🕌 তাহাজ্জুদ নামাজ
╚═❖🌌❖═╝
✨ রাতের শেষ ভাগের সেরা ইবাদত।
✨ যারা তাহাজ্জুদ পড়ে, আল্লাহ তাদের দোয়া কবুল করেন।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

      "ফজর": { time: prayerTimes.fajr, msg: 
`╔═❖🌅❖═╗
🕌 ফজর নামাজ
╚═❖🌅❖═╝
✨ ঘুম ভাঙার পর যে সেজদা, সেটাই আসল বিজয়।
✨ ভোরের আলোয় নামাজ মানে রহমত আর প্রশান্তি।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

      "যোহর": { time: prayerTimes.dhuhr, msg: 
`╔═❖☀️❖═╗
🕌 যোহর নামাজ
╚═❖☀️❖═╝
✨ দিনের ব্যস্ততার মাঝেই শান্তির ডাক।
✨ রোদের তাপে সেজদা মানে ঠাণ্ডা সুখ।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

      "আসর": { time: prayerTimes.asr, msg: 
`╔═❖🌇❖═╗
🕌 আসর নামাজ
╚═❖🌇❖═╝
✨ বিকেলের সোনালী আলোয় দোয়ার শান্তি।
✨ আসর ছাড়া দিনের ইবাদত অসম্পূর্ণ।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

      "মাগরিব": { time: prayerTimes.maghrib, msg: 
`╔═❖🌙❖═╗
🕌 মাগরিব নামাজ
╚═❖🌙❖═╝
✨ সূর্যাস্তের পর প্রথম সেজদার নূর।
✨ মাগরিবেই দিনের ক্লান্তি মুছে যায়।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

      "ইশা": { time: prayerTimes.isha, msg: 
`╔═❖🌌❖═╗
🕌 ইশা নামাজ
╚═❖🌌❖═╝
✨ রাতের আঁধারে সেরা ইবাদতের প্রশান্তি।
✨ ইশার সেজদা মানে ঘুমানোর আগে জান্নাতের প্রস্তুতি।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` }
    };

    for (const job of jobs) job.cancel();
    jobs = [];

    for (let [prayer, data] of Object.entries(times)) {
      let notifyTime = new Date(data.time);
      if (data.offset) notifyTime.setMinutes(notifyTime.getMinutes() + data.offset);

      const hour = notifyTime.getHours();
      const minute = notifyTime.getMinutes();

      const job = schedule.scheduleJob({ hour, minute, tz: "Asia/Dhaka" }, function () {
        const today = new Date();
        const day = today.getDay();
        if (day === 5 && prayer === "যোহর") return;

        for (const threadID of global.data.allThreadID) {
          api.sendMessage(data.msg, threadID);
        }
      });

      jobs.push(job);
    }

    // জুমা
    const jumuahJob = schedule.scheduleJob({ dayOfWeek: 5, hour: 12, minute: 45, tz: "Asia/Dhaka" }, function () {
      const jumuahMsg =
`╔═❖🕌❖═╗
✨ জুমার নামাজ ✨
╚═❖🕌❖═╝
🤲 আজ শুক্রবার।
🕌 সবাই সুন্দরভাবে প্রস্তুতি নিয়ে
মসজিদে গিয়ে জুমার নামাজ আদায় করুন।
📖 সূরা কাহফ পড়তে ভুলবেন না।
🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝗿 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

      for (const threadID of global.data.allThreadID) {
        api.sendMessage(jumuahMsg, threadID);
      }
    });

    jobs.push(jumuahJob);
  }

  scheduleForToday();
  schedule.scheduleJob({ hour: 0, minute: 5, tz: "Asia/Dhaka" }, scheduleForToday);

  console.log("✅ আজান নোটিফিকেশন (Dynamic, Dohar) চালু হয়েছে।");
};

module.exports.run = async function() {};
