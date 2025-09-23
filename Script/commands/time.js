const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "time",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash",
  description: "Displays current time and calendar in Bengali format.",
  commandCategory: "Info",
  cooldowns: 1,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "moment-timezone": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // বটের আপটাইম
  const uptime = process.uptime(),
    hours = Math.floor(uptime / 3600),
    minutes = Math.floor((uptime % 3600) / 60),
    seconds = Math.floor(uptime % 60);

  // ঢাকার সময়
  const now = moment.tz("Asia/Dhaka");

  const timeStr = now.format("hh:mm A"); // সময়
  const dateStr = now.format("DD"); // ইংরেজি তারিখ (দিন)
  const monthStr = now.format("MMMM"); // মাস
  const dayStr = now.format("dddd"); // সপ্তাহের দিন

  // হিজরি / বাংলা ডেট (ডেমো হিসেবে)
  const banglaMonth = "আশ্বিন: ৭";
  const hijriMonth = "রবিউস সানি: ১";

  // Owner mention
  const ownerID = "61577052283173";
  let ownerText = "Saiful Islam"; 
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const memberIDs = threadInfo.participantIDs || [];
    if (memberIDs.includes(ownerID)) {
      ownerText = { tag: "SAIFUL ISLAM ", id: ownerID };
    }
  } catch (err) {
    console.log(err);
  }

  // মেসেজ ফরম্যাট
  const message =
`======= 𝗧𝗜𝗠𝗘 =======
🕒 সময়: ${timeStr}
📅 ইংরেজি তারিখ: ${dateStr} 
🗒️ মাস : ${monthStr}
📛 দিন: ${dayStr}
🗓️ ${banglaMonth}
🕌 ${hijriMonth}
━━━━━━━━━━━━━
⏳ আপটাইম: ${hours}h ${minutes}m ${seconds}s
👑 বট ওনার: ${typeof ownerText === "string" ? ownerText : ownerText.tag}`;

  api.sendMessage(message, threadID);
};
