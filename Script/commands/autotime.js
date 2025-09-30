const moment = require("moment-timezone");
require("moment-hijri");

module.exports.config = {
  name: "autotime",
  version: "6.0.0",
  hasPermssion: 2,
  credits: "ALVI + Saiful Edit",
  description: "বট চালু হলেই প্রতি ঘন্টা সময়, বাংলা, হিজরি তারিখ ও দোয়া পাঠাবে",
  commandCategory: "system",
  usages: "autotime",
  cooldowns: 5,
};

const runningGroups = new Set();

const banglaWeekdays = [
  "রবিবার", "সোমবার", "মঙ্গলবার",
  "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

// সংখ্যা বাংলায় কনভার্ট
function toBanglaNumber(number) {
  const banglaDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return number.toString().replace(/\d/g, d => banglaDigits[d]);
}

// বাংলা তারিখ ফাংশন (সঠিক মাস ও বছর হ্যান্ডেল)
function getBanglaDate(now) {
  const gDate = now.date();
  const gMonth = now.month(); // 0 = জানুয়ারি
  const gYear = now.year();

  let banglaYear = gYear - 593;
  let banglaMonth = "";
  let banglaDay = gDate;

  if ((gMonth === 3 && gDate >= 14) || (gMonth === 4 && gDate <= 14)) {
    banglaMonth = "বৈশাখ";
    if (gMonth === 3 && gDate >= 14) banglaYear++;
    banglaDay = (gMonth === 3) ? gDate - 13 : gDate + 17;
  } else if ((gMonth === 4 && gDate >= 15) || (gMonth === 5 && gDate <= 14)) {
    banglaMonth = "জ্যৈষ্ঠ";
    banglaDay = (gMonth === 4) ? gDate - 14 : gDate + 17;
  } else if ((gMonth === 5 && gDate >= 15) || (gMonth === 6 && gDate <= 15)) {
    banglaMonth = "আষাঢ়";
    banglaDay = (gMonth === 5) ? gDate - 14 : gDate + 16;
  } else if ((gMonth === 6 && gDate >= 16) || (gMonth === 7 && gDate <= 15)) {
    banglaMonth = "শ্রাবণ";
    banglaDay = (gMonth === 6) ? gDate - 15 : gDate + 16;
  } else if ((gMonth === 7 && gDate >= 16) || (gMonth === 8 && gDate <= 15)) {
    banglaMonth = "ভাদ্র";
    banglaDay = (gMonth === 7) ? gDate - 15 : gDate + 16;
  } else if ((gMonth === 8 && gDate >= 16) || (gMonth === 9 && gDate <= 15)) {
    banglaMonth = "আশ্বিন";
    banglaDay = (gMonth === 8) ? gDate - 15 : gDate + 15;
  } else if ((gMonth === 9 && gDate >= 16) || (gMonth === 10 && gDate <= 15)) {
    banglaMonth = "কার্তিক";
    banglaDay = (gMonth === 9) ? gDate - 15 : gDate + 16;
  } else if ((gMonth === 10 && gDate >= 16) || (gMonth === 11 && gDate <= 15)) {
    banglaMonth = "অগ্রহায়ণ";
    banglaDay = (gMonth === 10) ? gDate - 15 : gDate + 16;
  } else if ((gMonth === 11 && gDate >= 16) || (gMonth === 0 && gDate <= 14)) {
    banglaMonth = "পৌষ";
    if (gMonth === 11 && gDate >= 16) {
      banglaDay = gDate - 15;
    } else {
      banglaDay = gDate + 16;
      banglaYear--;
    }
  } else if ((gMonth === 0 && gDate >= 15) || (gMonth === 1 && gDate <= 13)) {
    banglaMonth = "মাঘ";
    banglaDay = (gMonth === 0) ? gDate - 14 : gDate + 17;
  } else if ((gMonth === 1 && gDate >= 14) || (gMonth === 2 && gDate <= 14)) {
    banglaMonth = "ফাল্গুন";
    banglaDay = (gMonth === 1) ? gDate - 13 : gDate + 17;
  } else {
    banglaMonth = "চৈত্র";
    banglaDay = (gMonth === 2) ? gDate - 14 : gDate + 17;
  }

  const weekday = banglaWeekdays[now.day()];
  return `${toBanglaNumber(banglaDay)} ${banglaMonth}, ${toBanglaNumber(banglaYear)} (${weekday})`;
}

// হিজরি তারিখ
function getHijriDate(now) {
  const hijri = moment(now).tz("Asia/Dhaka").format("iD iMMMM, iYYYY");
  return hijri.replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

// সময় পাঠানোর ফাংশন
function sendTime(api, threadID) {
  if (!runningGroups.has(threadID)) return;

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const time = now.format("hh:mm A");
  const date = now.format("DD/MM/YYYY, dddd");
  const banglaDate = getBanglaDate(now);
  const hijriDate = getHijriDate(now);

  const msg = `
  ╔═❖═❖═❖═❖═❖═❖═╗
   ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
  ╚═❖═❖═❖═❖═❖═❖═╝
     ╔═✪═🕒═✪═╗
     সময়: ${time}
     ╚════════╝
📅 ইংরেজি তারিখ: ${date}
🗓️ বাংলা তারিখ: ${banglaDate}
🕌 হিজরি তারিখ: ${hijriDate}
🌍 টাইমজোন: ${timeZone}
━━━━━━━━━━━━━━━━━━━━
✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..! 
🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..!
🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..!
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐮 🌟
`;

  api.sendMessage(msg, threadID);
}

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  if (runningGroups.has(threadID)) {
    return api.sendMessage("⏰ এই গ্রুপে ইতিমধ্যে AutoTime চলছে!", threadID);
  }

  runningGroups.add(threadID);
  api.sendMessage("✅ বট চালু হয়েছে। এখন থেকে প্রতি ঘন্টা সময়, তারিখ ও দোয়া পাঠানো হবে।", threadID);

  const timeZone = "Asia/Dhaka";
  const now = moment().tz(timeZone);
  const nextHour = now.clone().add(1, "hour").startOf("hour");
  let delay = nextHour.diff(now);

  setTimeout(function tick() {
    if (!runningGroups.has(threadID)) return;

    sendTime(api, threadID);

    setInterval(() => {
      if (!runningGroups.has(threadID)) return;
      sendTime(api, threadID);
    }, 60 * 60 * 1000);

  }, delay);
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;

  if (!runningGroups.has(threadID)) {
    runningGroups.add(threadID);

    const timeZone = "Asia/Dhaka";
    const now = moment().tz(timeZone);
    const nextHour = now.clone().add(1, "hour").startOf("hour");
    let delay = nextHour.diff(now);

    setTimeout(function tick() {
      if (!runningGroups.has(threadID)) return;

      sendTime(api, threadID);

      setInterval(() => {
        if (!runningGroups.has(threadID)) return;
        sendTime(api, threadID);
      }, 60 * 60 * 1000);

    }, delay);
  }
};
