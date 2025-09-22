const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');
const axios = require('axios'); // API কলের জন্য

module.exports.config = {
    name: 'timeannounce',
    version: '2.0.3',
    hasPermssion: 0,
    credits: 'Akash',
    description: 'Automatically sends hourly TIME message with date, day info & API call',
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
    const day = date.date();
    const month = banglaMonths[date.month()];
    return { day, month };
}

function getHijriDate(date) {
    const hijri = require('moment-hijri');
    const hDate = hijri(date).format('iD iMMMM');
    const [day, ...monthParts] = hDate.split(' ');
    const month = monthParts.join(' ');
    return { day, month };
}

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ TIME ANNOUNCE COMMAND LOADED ============"));

    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Dhaka';
    rule.minute = 0; // প্রতি ঘন্টায়
    rule.second = 0;

    schedule.scheduleJob(rule, async () => {
        if (!global.data?.allThreadID) return;

        const now = moment.tz('Asia/Dhaka');
        const banglaDate = getBanglaDate(now);
        const hijriDate = getHijriDate(now);
        const dayOfWeek = now.format('dddd');

        const message = `======= 𝗧𝗜𝗠𝗘 =======
🕒 সময়: ${now.format('hh:mm A')}
📅 ইংরেজি তারিখ: ${now.format('DD')}
🗒️ মাস: ${now.format('MMMM')}
📛 দিন: ${dayOfWeek}
🗓️ ${banglaDate.month}: ${banglaDate.day}
🕌 ${hijriDate.month}: ${hijriDate.day}
━━━━━━━━━━━━━`;

        // Messenger message
        global.data.allThreadID.forEach(threadID => {
            api.sendMessage(message, threadID, (err) => {
                if (err) console.error(`Failed to send message to ${threadID}:`, err);
            });
        });

        // API call
        const payload = {
            time: now.format('hh:mm A'),
            englishDate: now.format('DD'),
            englishMonth: now.format('MMMM'),
            day: dayOfWeek,
            banglaDay: banglaDate.day,
            banglaMonth: banglaDate.month,
            hijriDay: hijriDate.day,
            hijriMonth: hijriDate.month
        };

        try {
            await axios.post('https://your-api-endpoint.com/time', payload);
            console.log(chalk.hex("#FFAA00")(`✅ Time data sent to API successfully at ${payload.time}`));
        } catch (error) {
            console.error(chalk.hex("#FF0000")("❌ Failed to send time data to API:"), error.message);
        }

        console.log(chalk.hex("#00FFFF")(`TIME message sent to all threads at ${now.format('hh:mm A')} BDT`));
    });
};

module.exports.run = () => {};
