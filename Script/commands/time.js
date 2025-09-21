const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "time",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "Joshua Sy", //don't change the credits please
 description: "Displays current time and bot runtime.",
 commandCategory: "Info",
 cooldowns: 1,
 dependencies: {
 "request": "",
 "fs-extra": "",
 "axios": ""
 }
};

module.exports.run = async function({ api, event }) {
 const uptime = process.uptime(),
 hours = Math.floor(uptime / 3600),
 minutes = Math.floor((uptime % 3600) / 60),
 seconds = Math.floor(uptime % 60);

 const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

 const imgLinks = [
 "https://i.imgur.com/EuiRi4v.jpeg",
 "https://i.imgur.com/ZjxQx17.jpeg",
 "https://i.imgur.com/dOO6Af5.jpeg",
 "https://i.imgur.com/WMIngcC.jpeg",
 "https://i.imgur.com/2dJSfXq.jpeg"
 ];

 const imgPath = __dirname + "/cache/time.jpg";
 const imgURL = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 const message = `🌸 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺 🌸

✨ 𝗕𝗼𝘁 𝗣𝗥𝗘𝗙𝗜𝗫: ${global.config.PREFIX}

📆 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗧𝗶𝗺𝗲: ${currentTime}

𝐇𝐢𝐣𝐫𝐢 𝐃𝐚𝐭𝐞 : ${hijriDate}

𝐁𝐚𝐧𝐠𝐥𝐚 𝐃𝐚𝐭𝐞 : ${banglaDate}


⏱️ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)

💠𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 𝐒𝐚𝐢𝐟𝐮𝐥 𝐈𝐬𝐥𝐚𝐦💠


¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶────██████────¶
¶─◥██████████◤─¶
¶──◥████████◤──¶
¶────◥████◤────¶
¶─────◥██◤─────¶

🌟 ─꯭─⃝‌‌𝐒𝐚𝐢𝐟𝐮𝐥  𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 🌟`;

 const callback = () => {
 api.sendMessage({
 body: message,
 attachment: fs.createReadStream(imgPath)
 }, event.threadID, () => fs.unlinkSync(imgPath));
 };

 request(encodeURI(imgURL)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
};
