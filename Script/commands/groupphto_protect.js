/**
 * groupphoto_protect.js
 * Auto-save & auto-restore group photo when changed.
 * Usage: this module auto-initializes — no manual setup required.
 *
 * Ensure:
 * 1) Bot has admin rights in the group (so it can setImage).
 * 2) Place this file in your modules folder and restart the bot.
 * 3) Node version supporting fs.promises (modern Node).
 */

const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "groupphoto_protect",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mohammad Akash",
  description: "Automatically save and restore group photo when changed",
  commandCategory: "admin",
  usages: "auto (no prefix needed for protection — admin commands available)",
  cooldowns: 3
};

const DATA_DIR = path.resolve(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "groupPhotos.json");

// ensure data dir & db exist
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

// helper to check admin permission when using admin-only commands
async function isThreadAdmin(api, threadID, senderID) {
  try {
    const info = await new Promise((res, rej) =>
      api.getThreadInfo(threadID, (err, data) => (err ? rej(err) : res(data)))
    );
    if (!info || !info.adminIDs) return false;
    return info.adminIDs.some(a => a.id == senderID);
  } catch (e) {
    return false;
  }
}

// run: listens for manual commands like "protect photo on/off" or "save group photo" (admin-only)
module.exports.run = async ({ api, event }) => {
  const { threadID, senderID, body = "" } = event;
  const text = (body || "").toLowerCase();

  if (text.startsWith("protect photo on") || text.startsWith("photo protect on")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন না থাকলে করা যাবে না।", threadID);
    const db = readDB();
    if (!db[threadID]) db[threadID] = {};
    db[threadID].protected = true;

    try {
      const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
      db[threadID].photo = info.imageSrc || db[threadID].photo || null;
    } catch (e) {}

    writeDB(db);
    return api.sendMessage("✅ *𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐎𝐍*", threadID);
  }

  if (text.startsWith("protect photo off") || text.startsWith("photo protect off")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন না থাকলে করা যাবে না।", threadID);
    const db = readDB();
    if (!db[threadID]) db[threadID] = {};
    db[threadID].protected = false;
    writeDB(db);
    return api.sendMessage("⛔ *𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧 𝐎𝐅𝐅*", threadID);
  }

  // manual save
  if (text.startsWith("save group photo") || text.startsWith("save photo")) {
    const ok = await isThreadAdmin(api, threadID, senderID);
    if (!ok) return api.sendMessage("⚠️ অ্যাডমিন হতে হবে।", threadID);

    try {
      const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
      const db = readDB();
      db[threadID] = db[threadID] || {};
      db[threadID].photo = info.imageSrc || null;
      db[threadID].protected = true;
      writeDB(db);
      return api.sendMessage(`✅ *𝐏𝐡𝐨𝐭𝐨 𝐒𝐚𝐯𝐞𝐝!*`, threadID);
    } catch (e) {
      return api.sendMessage("❌ এরর: গ্রুপ ইনফো পাওয়া যায়নি।", threadID);
    }
  }

  if (text === "photo protect status") {
    const db = readDB();
    const entry = db[threadID] || {};
    const prot = entry.protected ? "ON" : "OFF";
    const photoSaved = entry.photo ? "✅ saved" : "— not saved";
    return api.sendMessage(`⚙️ *𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐒𝐭𝐚𝐭𝐮𝘀*\n\n*Saved:* ${photoSaved}\n*Protected:* ${prot}`, threadID);
  }
};

// handleEvent: automatic detection of group photo change
module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, logMessageType } = event;
    if (logMessageType && logMessageType !== "log:thread-icon") return;

    const db = readDB();
    const entry = db[threadID];
    if (!entry || !entry.protected) {
      // auto-save current photo if not exists
      try {
        const info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
        const photoNow = info.imageSrc || null;
        if (!entry?.photo && photoNow) {
          db[threadID] = db[threadID] || {};
          db[threadID].photo = photoNow;
          db[threadID].protected = true;
          writeDB(db);
          api.sendMessage(`✅ *𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐒𝐚𝐯𝐞𝐝 𝐀𝐮𝐭𝐨𝐦𝐚𝐭𝐢𝐜𝐚𝐥𝐥𝐲!*`, threadID);
        }
      } catch (e) {}
      return;
    }

    const savedPhoto = entry.photo;
    if (!savedPhoto) return;

    // get current photo
    let info;
    try {
      info = await new Promise((res, rej) => api.getThreadInfo(threadID, (err, d) => err ? rej(err) : res(d)));
    } catch (e) {
      console.error("Failed to getThreadInfo:", e);
      return;
    }

    const currentPhoto = info.imageSrc || null;
    if (currentPhoto === savedPhoto) return;

    // restore photo
    api.setThreadImage(savedPhoto, threadID, (err) => {
      if (err) {
        console.error("Failed to restore group photo:", err);
        return api.sendMessage("❌ *𝐄𝐫𝐫𝐨𝐫:* গ্রুপ ফটো রিস্টোর করতে পারছি না।", threadID);
      }

      const notify = `
╔═❖════════════❖═╗
⚠️𝐆𝐫𝐨𝐮𝐩 𝐏𝐡𝐨𝐭𝐨 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐞𝐃!⚠️
╚═❖════════════❖═╝

🔄 কারো দ্বারা গ্রুপের ফটো পরিবর্তন করা হয়েছিল,
   তাই বট স্বয়ংক্রিয়ভাবে পূর্বের ফটো ফিরিয়ে দিয়েছে।

🛡️ অনুগ্রহ করে গ্রুপের ফটো পরিবর্তন করবেন না। 
   প্রয়োজনে কেবল অ্যাডমিনের সঙ্গে আলোচনা করুন।

✨🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦 🌟✨
`;
      api.sendMessage(notify, threadID);
    });
  } catch (e) {
    console.error("handleEvent error:", e);
  }
};
