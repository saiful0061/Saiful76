const schedule = require("node-schedule");
const moment = require("moment-timezone");
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '10.0.1',
    hasPermssion: 0,
    credits: 'Shahadat Islam',
    description: 'Automatically sends messages at scheduled times (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

module.exports.onLoad = async ({ api }) => {
  console.log("✅ AutoSent TIME Module Loaded");

  // সব থ্রেড লোডিং নিশ্চিত করা
  if (!global.data) global.data = {};
  if (!global.data.allThreadID) {
    try {
      const threads = await api.getThreadList(100, null, []);
      global.data.allThreadID = threads.map(thread => thread.threadID);
      console.log("✅ Thread list loaded:", global.data.allThreadID.length, "threads");
    } catch (err) {
      console.error("❌ Failed to load threads:", err);
      global.data.allThreadID = [];
    }
  }

  // প্রতি ঘণ্টায় ট্রিগার করার জন্য schedule
  schedule.scheduleJob('0 * * * *', () => {
    let now = moment().tz("Asia/Dhaka");
    console.log("⏰ AutoSent triggered at:", now.format());

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

    // সময়
    let timeNow = now.format("hh:mm A");

    let message = 
`╔═❖═❖═❖═❖═❖═❖═╗
    ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
 ╚═❖═❖═❖═❖═❖═❖═╝
       ╔═✪═🕒═✪═╗
       সময় : ${timeNow}
       ╚════════╝
📅 ইংরেজি তারিখ: ${engDate}
📛 দিন: ${weekDay}
🗓️ বাংলা: ${banglaDay} ${banglaMonth}
🕌 হিজরি: ${hDay} ${hMonth} ${hYear}
━━━━━━━━━━━━━━━━━━━━
✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..! 
🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..!
🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..!
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝗺 🌟━━━━━━━━━━━━━━━`;

    if (!global.data.allThreadID.length) return;
    global.data.allThreadID.forEach(threadID => {
      api.sendMessage(message, threadID, (err) => {
        if (err) console.error(`❌ Error sending message to ${threadID}:`, err);
      });
    });
  });
};

module.exports.run = () => {};
