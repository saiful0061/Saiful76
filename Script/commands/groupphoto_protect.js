/**
 * groupphoto_protect.js
 * Auto-save & auto-restore group photo when changed.
 * Styled messages version with Admin/Bot exclusion.
 *
 * Usage:
 * 1) Bot must have admin rights in the group (so it can setAvatar).
 * 2) Place this file in your modules folder and restart the bot.
 */

const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "groupphoto_protect",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash",
  description: "Auto-save & restore group photo (exclude Admin/Bot), styled messages",
  commandCategory: "admin",
  usages: "auto (no prefix needed — Auto-Save & Restore)",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "groupPhotos.json");

function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}), "utf8");
}

function readDB() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("Error reading groupPhotos DB:", e);
    return {};
  }
}

function writeDB(db) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function styledMessage(type) {
  switch(type) {
    case "autoSave":
      return `╭─━━━━━━━━━━━━─╮
✅ 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜 𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐒𝐚𝐯𝐞𝐝
╰─━━━━━━━━━━━━─╯

🛡️ এখন থেকে কেউ অ্যাডমিন ছাড়া গ্রুপ ছবি পরিবর্তন করলে বট আগের ছবি রিস্টোর করবে।`;
    case "restore":
      return `╭─━━━━━━━━━━━━─╮
⚠️ 𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐑𝐞𝐬𝐭𝐨𝐫𝐞𝐝
╰─━━━━━━━━━━━━─╯

🛡️ গ্রুপের ছবি পরিবর্তন হয়েছিল, তাই আগের ছবি ফিরিয়ে দেওয়া হলো। 
অ্যাডমিন ছাড়া ছবির পরিবর্তন করবেন না।`;
    default: return "";
  }
}

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const db = readDB();

  try {
    const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
    db[threadID] = db[threadID] || {};
    if (!db[threadID].photo) {
      db[threadID].photo = info.imageSrc || null;
      writeDB(db);
      return api.sendMessage(styledMessage("autoSave"), threadID);
    }
  } catch(e) {
    return api.sendMessage("❌ এরর: গ্রুপ ইনফো নেয়া যায়নি।", threadID);
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, logMessageType, logMessageData } = event;
    if (!logMessageType || logMessageType !== "log:thread-icon") return;

    const db = readDB();
    const entry = db[threadID];
    if (!entry || !entry.photo) {
      try {
        const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
        db[threadID] = db[threadID] || {};
        if (!db[threadID].photo) {
          db[threadID].photo = info.imageSrc || null;
          writeDB(db);
          return api.sendMessage(styledMessage("autoSave"), threadID);
        }
      } catch(e){}
      return;
    }

    const savedPhoto = entry.photo;
    let info;
    try {
      info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
    } catch(e){ return; }

    const currentPhoto = info.imageSrc || "";
    if (currentPhoto === savedPhoto) return;

    // চেঞ্জ কারা করেছে
    const changerID = logMessageData?.author || logMessageData?.adminID;
    const botID = api.getCurrentUserID();

    // সকল অ্যাডমিন IDs
    const threadAdmins = info.adminIDs?.map(a => a.id) || [];

    // যদি যিনি চেঞ্জ করেছেন তারা বট বা অ্যাডমিন হয়, রিস্টোর না করা
    if (changerID === botID || threadAdmins.includes(changerID)) return;

    // অন্যরা চেঞ্জ করলে রিস্টোর
    api.setAvatar(savedPhoto, threadID, (err) => {
      if (err) {
        console.error("Failed to restore group photo:", err);
        return api.sendMessage("❌ *𝐄𝐫𝐫𝐨𝐫:* ছবি রিস্টোর করতে পারছি না — বটকে অ্যাডমিন করা আছে কি দেখো।", threadID);
      }
      api.sendMessage(styledMessage("restore"), threadID);
    });

  } catch(e) {
    console.error("handleEvent error:", e);
  }
};
