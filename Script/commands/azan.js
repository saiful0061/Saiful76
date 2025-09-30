// azan.js
// Auto Azan notification in ALL groups (Manual time version)
// File: modules/commands/azan.js

const schedule = require("node-schedule");

module.exports.config = {
  name: "azan",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "Akash + Saiful Edit",
  description: "প্রতিদিন আজান ও নামাজের সময় সব গ্রুপে অটো নোটিফিকেশন পাঠাবে",
  commandCategory: "Islamic",
  usages: "অটো রান",
  cooldowns: 5
};

let jobs = [];

module.exports.onLoad = async function({ api }) {
  // আজানের টাইম (বাংলাদেশ স্ট্যান্ডার্ড টাইম)
  const prayerTimes = {
    "তাহাজ্জুদ": { time: "02:30", msg: 
`╔═❖🌌❖═╗
🕌 তাহাজ্জুদ নামাজ
╚═❖🌌❖═╝
✨ রাতের শেষ ভাগের সেরা ইবাদত।
✨ যারা তাহাজ্জুদ পড়ে, আল্লাহ তাদের দোয়া কবুল করেন।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "ফজর": { time: "04:24", msg: 
`╔═❖🌅❖═╗
🕌 ফজর নামাজ
╚═❖🌅❖═╝
✨ ঘুম ভাঙার পর যে সেজদা, সেটাই আসল বিজয়।
✨ ভোরের আলোয় নামাজ মানে রহমত আর প্রশান্তি।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "যোহর": { time: "13:00", msg: 
`╔═❖☀️❖═╗
🕌 যোহর নামাজ
╚═❖☀️❖═╝
✨ দিনের ব্যস্ততার মাঝেই শান্তির ডাক।
✨ রোদের তাপে সেজদা মানে ঠাণ্ডা সুখ।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "আসর": { time: "16:30", msg: 
`╔═❖🌇❖═╗
🕌 আসর নামাজ
╚═❖🌇❖═╝
✨ বিকেলের সোনালী আলোয় দোয়ার শান্তি।
✨ আসর ছাড়া দিনের ইবাদত অসম্পূর্ণ।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "মাগরিব": { time: "18:06", msg: 
`╔═❖🌙❖═╗
🕌 মাগরিব নামাজ
╚═❖🌙❖═╝
✨ সূর্যাস্তের পর প্রথম সেজদার নূর।
✨ মাগরিবেই দিনের ক্লান্তি মুছে যায়।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` },

    "ইশা": { time: "20:40", msg: 
`╔═❖🌌❖═╗
🕌 ইশা নামাজ
╚═❖🌌❖═╝
✨ রাতের আঁধারে সেরা ইবাদতের প্রশান্তি।
✨ ইশার সেজদা মানে ঘুমানোর আগে জান্নাতের প্রস্তুতি।
🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟` }
  };

  // প্রতিদিনের ওয়াক্ত
  for (let [prayer, { time, msg }] of Object.entries(prayerTimes)) {
    const [hour, minute] = time.split(":").map(Number);

    const job = schedule.scheduleJob({ hour, minute, tz: "Asia/Dhaka" }, function () {
      const today = new Date();
      const day = today.getDay(); // Sunday = 0 ... Friday = 5

      // শুক্রাবার হলে যোহর স্কিপ করতে হবে
      if (day === 5 && prayer === "যোহর") return;

      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });

    jobs.push(job);
  }

  // জুমার নামাজ (শুধু শুক্রবার 12:45 এ)
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

  console.log("✅ আজান নোটিফিকেশন + তাহাজ্জুদ + জুমার সিস্টেম চালু হয়েছে (সব গ্রুপে)।");
};

module.exports.run = async function() {
  // কোনো কমান্ড দরকার নেই, অটো চলবে
};
