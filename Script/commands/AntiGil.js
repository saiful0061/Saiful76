let antiGaliStatus = false; // Default Off now
let offenseTracker = {}; // threadID -> userID -> { count, uidSaved }

const badWords = [
  "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","চুদামারান",
  "চুদির","চুত","চুদি","চুতমারানি","চুদের বাচ্চা","shawya","বালের","বালের ছেলে","বালছাল",
  "বালছাল কথা","মাগীর ছেলে","রান্ডি","রান্দি","রান্দির ছেলে","বেশ্যা","বেশ্যাপনা",
  "Khanki","mgi","তোকে চুদি","তুই চুদ","fuck","f***","fck","fuk","fuk","fking","fing","fucking",
  "motherfucker","guyar","mfer","motherfuer","mthrfckr","putki","abdullak chudi","abdullak xudi","jawra","bot chudi","bastard",
  "asshole","a$$hole","a*hole","dick","fu***k","cock","prick","pussy","Mariak cudi","cunt","fag","faggot","retard",
  "magi","magir","magirchele","land","randir","randirchele","chuda","chud","chudir","chut","chudi","chutmarani",
  "tor mayer","tor baper","toke chudi","chod","jairi","khankir pola","khanki magi"
];

module.exports.config = {
  name: "antigali",
  version: "3.3.0",
  hasPermssion: 0,
  credits: "Rx Abdullah", // always locked
  description: "Per-user anti-gali with UID match for kick + admin checks (default ON)",
  commandCategory: "moderation",
  usages: "!antigali on / !antigali off",
  cooldowns: 0
};

// === CREDIT LOCK SYSTEM ===
// Obfuscated/encoded LOCKED_CREDITS
const encodedCredits = "UnggIEFidHVsYWg="; // Base64 of "Rx Abdullah"
const LOCKED_CREDITS = Buffer.from(encodedCredits, "base64").toString("utf-8");

// Encoded warning message (base64)
function getCreditWarning() {
  const encoded = "4pKp4pSx4pS64pSx4pSg4pS44pS84pS+4pS84pS/4pS/"; 
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

// Intercept console.log for credits
const originalConsoleLog = console.log;
console.log = function(...args) {
  if (args.some(a => a === module.exports.config.credits && module.exports.config.credits !== LOCKED_CREDITS)) {
    module.exports.config.credits = LOCKED_CREDITS;
    originalConsoleLog(getCreditWarning());
  } else {
    originalConsoleLog(...args);
  }
};

// Check credits for runtime tampering
async function checkCredits(api, threadID) {
  if (module.exports.config.credits !== LOCKED_CREDITS) {
    module.exports.config.credits = LOCKED_CREDITS;
    try { await api.sendMessage(getCreditWarning(), threadID); } catch(e) {}
    return false;
  }
  return true;
}

// === HANDLE EVENT ===
module.exports.handleEvent = async function ({ api, event, Threads }) {
  try {
    if (!await checkCredits(api, event.threadID)) return; // stop if credits tampered
    if (!antiGaliStatus || !event.body) return;

    const message = event.body.toLowerCase();
    const threadID = event.threadID;
    const userID = event.senderID;
    const botID = api.getCurrentUserID && api.getCurrentUserID(); 

    if (!offenseTracker[threadID]) offenseTracker[threadID] = {};
    if (!offenseTracker[threadID][userID]) offenseTracker[threadID][userID] = { count: 0, uidSaved: userID };

    if (!badWords.some(word => message.includes(word))) return;

    let userData = offenseTracker[threadID][userID];
    userData.count += 1;
    const count = userData.count;

    let userInfo = {};
    try { userInfo = await api.getUserInfo(userID); } catch (e) {}
    const userName = userInfo[userID]?.name || "User";

    let threadInfo = {};
    try {
      if (Threads && typeof Threads.getData === "function") {
        const tdata = await Threads.getData(threadID);
        threadInfo = tdata.threadInfo || {};
      } else if (typeof api.getThreadInfo === "function") {
        threadInfo = await api.getThreadInfo(threadID) || {};
      } else { threadInfo = {}; }
    } catch (e) { threadInfo = {}; }

    const isAdminInThread = (uid) => {
      try {
        if (!threadInfo || !threadInfo.adminIDs) return false;
        return threadInfo.adminIDs.some(item => {
          if (typeof item === "string") return item == String(uid);
          if (item && item.id) return String(item.id) == String(uid);
          return false;
        });
      } catch (e) { return false; }
    };

    const frameBase = (n, extraLine = '') => (
`╔══════════════════════════════╗
⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 #${n}
User: ${userName} (UID: ${userID})
Message contains prohibited words
🔁 Offense Count: ${n}
${extraLine}
╚══════════════════════════════╝`
    );

    if (count === 1) {
      const msg = frameBase(1, '🛑 Please clean/unsend immediately');
      await api.sendMessage(msg, threadID, event.messageID);
    } else if (count === 2) {
      const msg = frameBase(2, '🛑 Please clean/unsend immediately\n⚠️ Next offense will result in removal');
      await api.sendMessage(msg, threadID, event.messageID);
    }

    setTimeout(() => {
      api.unsendMessage(event.messageID).catch(err => console.error("Failed to unsend:", err));
    }, 60000);

    if (count === 3) {
      const botIsAdmin = botID ? isAdminInThread(botID) : false;
      if (!botIsAdmin) {
        userData.count = 2;
        return api.sendMessage(
`╔══════════════════════════════╗
⚠️ 𝗔𝗖𝗧𝗜𝗢𝗡 𝗕𝗟𝗢𝗖𝗞𝗘𝗗
I (bot) am not a group admin, so I cannot remove users.
Please promote the bot to admin or have a human admin remove the user.
User: ${userName} (UID: ${userID})
╚══════════════════════════════╝`,
          threadID
        );
      }

      if (isAdminInThread(userID)) {
        userData.count = 2;
        return api.sendMessage(
`╔══════════════════════════════╗
⚠️ 𝗔𝗖𝗧𝗜𝗢𝗡 𝗕𝗟𝗢𝗖𝗞𝗘𝗗
Cannot remove user because they are a group admin.
User: ${userName} (UID: ${userID})
If you believe removal is still needed, a group admin must remove them manually.
╚══════════════════════════════╝`,
          threadID
        );
      }

      try {
        await api.removeUserFromGroup(userID, threadID);
        userData.count = 0;
        return api.sendMessage(
`🚨 User ${userName} (UID: ${userID}) has been removed due to repeated offenses.`,
          threadID
        );
      } catch (kickErr) {
        console.error("Kick error:", kickErr);
        userData.count = 2;
        return api.sendMessage(
`⚠️ Failed to kick ${userName} (UID: ${userID}). Check bot permissions and try again.`,
          threadID
        );
      }
    }

  } catch (error) {
    console.error("HandleEvent error:", error);
    try {
      await api.sendMessage("⚠️ Anti-Gali system error occurred. Check bot logs.", event.threadID);
    } catch (e) {}
  }
};

// === RUN COMMAND ===
module.exports.run = async function ({ api, event, args }) {
  try {
    if (!(await checkCredits(api, event.threadID))) return; // stop if credits tampered

    if (args[0] === "on") {
      antiGaliStatus = true;
      return api.sendMessage("✅ Anti-Gali system is now ON", event.threadID);
    } else if (args[0] === "off") {
      antiGaliStatus = false;
      return api.sendMessage("❌ Anti-Gali system is now OFF", event.threadID);
    } else {
      return api.sendMessage("Usage: !antigali on / !antigali off", event.threadID);
    }
  } catch (runErr) {
    console.error("Run command error:", runErr);
    try {
      await api.sendMessage("⚠️ Failed to run Anti-Gali command. Check bot logs.", event.threadID);
    } catch (e) {}
  }
};
