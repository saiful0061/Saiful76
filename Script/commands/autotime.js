const schedule = require("node-schedule");
const moment = require("moment-timezone");
require("moment/locale/bn");
require("moment-hijri");

module.exports.config = {
 name: "autosent",
 version: "10.0.11",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Automatically sends time updates (BD, Bangla, Hijri date)",
 commandCategory: "group",
 usages: "",
 cooldowns: 3
};

module.exports.onLoad = ({ api }) => {
 console.log("✅ AutoSent TIME Module Loaded");

 const rule = new schedule.RecurrenceRule();
 rule.tz = "Asia/Dhaka";
 rule.minute = 0; // প্রতি ঘণ্টায় একবার পাঠাবে

 schedule.scheduleJob(rule, () => {
 let now = moment().tz("Asia/Dhaka");

 // ইংরেজি তারিখ
 let engDate = now.locale("en").format("D MMMM YYYY");
 let weekDay = now.locale("en").format("dddd");

 // বাংলা মাস ম্যানুয়ালি
 const banglaMonths = [
 "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
 "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
 ];
 let banglaDay = now.date();
 // বাংলা মাসের হিসাব করার জন্য ১৩ দিন শিফট প্রয়োজন
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
    সময়:${timeNow}
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

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟`;

 if (!global.data?.allThreadID) return;
 global.data.allThreadID.forEach(threadID => {
 api.sendMessage(message, threadID, (err) => {
 if (err) console.error(`❌ Error sending message to ${threadID}:`, err);
 });
 });
 });
};

module.exports.run = () => {};
