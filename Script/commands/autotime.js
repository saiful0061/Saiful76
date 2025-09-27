const schedule = require("node-schedule");
const moment = require("moment-timezone");
require("moment/locale/bn");
require("moment-hijri")(moment);

module.exports.config = {
  name: "autosent",
  version: "10.0.12",
  hasPermssion: 0,
  credits: "SUJON",
  description: "Automatically sends time updates (BD, Bangla, Hijri date)",
  commandCategory: "group",
  usages: "",
  cooldowns: 3
};

module.exports.onLoad = ({ api }) => {
  console.log("✅ AutoSent TIME Module Loaded");

  if (!global.data) global.data = {};
  if (!global.data.allThreadID) global.data.allThreadID = [];

  // Thread list লোড
  api.getThreadList(100, null, [], (err, list) => {
    if (err) {
      console.error("❌ Failed to load threads:", err);
      return;
    }
    global.data.allThreadID = list.map(t => t.threadID);
    console.log("✅ Thread list loaded:", global.data.allThreadID.length, "threads");
  });

  // প্রতি ঘণ্টায় পাঠানো
  schedule.scheduleJob("0 * * * *", () => {
    let now = moment().tz("Asia/Dhaka");

    let engDate = now.locale("en").format("D MMMM YYYY");
    let weekDay = now.locale("en").format("dddd");

    const banglaMonths = ["বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র"];
    let banglaDay = now.date();
    let banglaMonthIndex = (now.month() + 8) % 12;
    let banglaMonth = banglaMonths[banglaMonthIndex];

    let hDay = now.iDate();
    let hMonthIndex = now.iMonth();
    const hijriMonths = ["মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি","জমাদিউল আউয়াল","জমাদিউস সানি","রজব","শা‘বান","রমজান","শাওয়াল","জিলকদ","জিলহজ্জ"];
    let hMonth = hijriMonths[hMonthIndex] || "N/A";
    let hYear = now.iYear();

    let timeNow = now.format("hh:mm A");

    let message = `⏰ সময় : ${timeNow}\n📅 ইংরেজি: ${engDate}\n📛 দিন: ${weekDay}\n🗓️ বাংলা: ${banglaDay} ${banglaMonth}\n🕌 হিজরি: ${hDay} ${hMonth} ${hYear}`;

    global.data.allThreadID.forEach(threadID => {
      api.sendMessage(message, threadID, err => {
        if (err) console.error(`❌ Error sending to ${threadID}:`, err);
      });
    });
  });
};

module.exports.run = () => {};
