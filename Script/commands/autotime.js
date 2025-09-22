const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'timeannounce',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'Akash',
    description: 'Automatically sends daily TIME message with date and day info',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

const banglaMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

const hijriMonths = [
    'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জুমাদিউল আউয়াল',
    'জুমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলক্বদ', 'জিলহজ'
];

function getBanglaDate(date) {
    const day = date.date(); // Bangla day, can convert if needed
    const month = banglaMonths[date.month()];
    return { day, month };
}

function getHijriDate(date) {
    // Simple Hijri approximation using moment-hijri
    const hijri = require('moment-hijri');
    const hDate = hijri(date).format('iD iMMMM'); // day + month
    const [day, ...monthParts] = hDate.split(' ');
    const month = monthParts.join(' ');
    return { day, month };
}

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ TIME ANNOUNCE COMMAND LOADED ============"));

    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Dhaka';
    rule.hour = 8; // 08:00 AM
    rule.minute = 0;

    schedule.scheduleJob(rule, () => {
        if (!global.data?.allThreadID) return;

        const now = moment.tz('Asia/Dhaka');
        const banglaDate = getBanglaDate(now);
        const hijriDate = getHijriDate(now);
        const dayOfWeek = now.format('dddd'); // Monday, Tuesday ... (English)
        
        const message = `======= 𝗧𝗜𝗠𝗘 =======
🕒 সময়: ${now.format('hh:mm A')}
📅 ইংরেজি তারিখ: ${now.format('DD')}
🗒️ মাস: ${now.format('MMMM')}
📛 দিন: ${dayOfWeek}
🗓️ আশ্বিন: ${banglaDate.day}
🕌 ${hijriDate.month}: ${hijriDate.day}
━━━━━━━━━━━━━`;

        global.data.allThreadID.forEach(threadID => {
            api.sendMessage(message, threadID, (err) => {
                if (err) console.error(`Failed to send message to ${threadID}:`, err);
            });
        });

        console.log(chalk.hex("#00FFFF")(`TIME message sent to all threads at ${now.format('hh:mm A')} BDT`));
    });
};

module.exports.run = () => {
    // Main logic handled in onLoad
};
