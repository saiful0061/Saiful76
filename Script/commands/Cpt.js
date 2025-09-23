const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: '\n',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Mohammad Akash',
    description: 'This command is for using my bot in your group.',
    commandCategory: 'Info',
    usages: '/',
    cooldowns: 11,
    dependencies: {
        'request': '',
        'fs-extra': '',
        'axios': ''
    }
};

module.exports.run = async function({ api, event }) {
    const Stream = require('fs-extra');

    // একবারে পুরো লেখা
    const messageBody = `🌸 Assalamualaikum 🌸  
🌺 Thanks you so much for using my bot your group ❤️‍🩹  
😻 I will you are members enjoy!🤗  

☢️ To view any command 📌  
/Help  
/Bot  
/Info  

𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫➢ 𝗦𝗔𝗜𝗙𝗨𝗟 𝗜𝗦𝗟𝗔𝗠`;

    // লোকাল ফাইল path
    const filePath = path.join(__dirname, 'cyber.jpg');

    // নতুন ইমেজ লিংকগুলো
    const images = [
        'https://i.imgur.com/WFHtK3d.png',
        'https://i.imgur.com/luzSTS3.png',
        'https://i.imgur.com/JKWVvKL.png',
        'https://i.imgur.com/RYGxu0J.png',
        'https://i.imgur.com/5P9Pckt.png'
    ];

    // র্যান্ডম ইমেজ বেছে নেওয়া
    const imageUrl = images[Math.floor(Math.random() * images.length)];
    const imageStream = request.get(encodeURI(imageUrl)).pipe(Stream.createWriteStream(filePath));

    // ইমেজ ডাউনলোড শেষ হলে মেসেজ পাঠানো
    imageStream.on('close', () => {
        api.sendMessage(
            {
                body: messageBody,
                attachment: Stream.createReadStream(filePath)
            },
            event.threadID,
            () => Stream.unlinkSync(filePath) // পাঠানোর পরে ফাইল ডিলিট
        );
    });
};
