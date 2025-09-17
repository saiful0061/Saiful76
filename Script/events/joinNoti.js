module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.4",
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "𝗦𝗵𝗮𝐡𝗮𝗱𝐚𝐭 𝗖𝗵𝗮𝐭 𝗕𝗼𝘁";

  // === বটকে গ্রুপে অ্যাড করলে ===
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    const botMediaLink = "https://i.imgur.com/t239z0g.gif"; // এখানে Imgur লিংক বসানো হলো

    api.sendMessage(
      "চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ 𝐂𝐡𝐚𝐭 𝐁𝐨𝐓 𝐛𝐲 Saiful এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ আঁড্ডাঁ দিঁবঁ..!",
      threadID,
      () => {
        const messageBody = `╭•┄┅═══❁🌺❁═══┅┄•╮
আসসালামু আলাইকুম💚
╰•┄┅═══❁🌺❁═══┅┄•╯

𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗
𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐚𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️

𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:
${botPrefix}Help
${botPrefix}Info
${botPrefix}Admin

★ যেকোনো অভিযোগ অথবা হেল্প এর জন্য এডমিন 𝙎𝙄𝙁𝙐𝙇   𝙄𝙎𝙇𝘼𝙈 কে নক করতে পারেন ★
➤𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫: https://www.facebook.com/profile.php?id=61577052283173
➤𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: https://wa.me/01833225797

❖⋆═══════════════════════⋆❖
          𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➢ 𝙎𝙄𝙁𝙐𝙇   𝙄𝙎𝙇𝘼𝙈`;

        api.sendMessage({ body: messageBody, attachment: botMediaLink }, threadID);
      }
    );

    return;
  }

  // === মেম্বার অ্যাড হলে ===
  try {
    const { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    const authorID = event.author;
    const authorInfo = await api.getUserInfo(authorID);
    const authorName = authorInfo[authorID].name;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = (typeof threadData.customJoin === "undefined") ?
`╭•┄┅══❁🌺❁══┅•╮
আসসালামু আলাইকুম💚
╰•┄┅══❁🌺❁══┅•╯

🥰 হাসি-ঠাট্টায় গড়ে উঠুক বন্ধুত্ব,  
💝 ভালোবাসা থাকুক আজীবন।  

➤ হাসি-মজা করে আড্ডা দিন।  
➤ সবার সাথে মিলেমিশে থাকুন।  
➤ খারাপ ব্যবহার ❌ নয়।  
➤ এডমিনের কথা শুনুন।✅  

›› প্রিয় {name},  
আপনি এই গ্রুপের {soThanhVien} নম্বর মেম্বার!  
➤ Added By : {authorMention}

›› গ্রুপ: {threadName}

💌 🌺 𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄 🌺 💌
╭─╼╾─╼🌸╾─╼╾───╮
   ─꯭─⃝‌‌BOT 𝙎𝙄𝙁𝙐𝙇   𝙄𝙎𝙇𝘼𝙈 🌺
╰───╼╾─╼🌸╾─╼╾─╯

❖⋆══════════════════════════⋆❖` : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName)
      .replace(/\{authorMention}/g, `@${authorName}`);

    mentions.push({ tag: authorName, id: authorID });

    const memberMediaLink = "https://i.imgur.com/3mykZ61.gif"; // Imgur লিংক বসানো হলো

    return api.sendMessage(
      { body: msg, attachment: memberMediaLink, mentions },
      threadID
    );
  } catch (e) {
    console.error(e);
  }
};
