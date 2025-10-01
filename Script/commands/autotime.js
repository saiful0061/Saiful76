// autotime.js
// Auto hourly Islamik messages (Bangla date) — compatible with FB-chat-style api (api.sendMessage, api.getThreadList)
//
// কনফিগারেশন:
module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  permission: 0,
  credits: "Jihad",
  description: "প্রতি ঘন্টায় ইসলামিক বার্তা পাঠায় (বাংলা তারিখ সহ, Asia/Dhaka)",
  prefix: true,
  commandCategory: "user",
  usages: "",
  cooldowns: 5,

  // যদি তুমি নির্দিষ্ট কোনো থ্রেডে পাঠাতে চাও, এখানে থ্রেড আইডি যোগ করো:
  // উদাহরণ: sendTo: ["1000123456789"]
  // খালি রাখলে ([]) সব গ্রুপে পাঠানো হবে (api.getThreadList ব্যবহার করে)।
  sendTo: [],

  // চেক ইন্টারভাল (মিলিসেকেন্ড) — ডিফল্ট 60,000 (এক মিনিটে একবার)
  checkInterval: 60 * 1000
};


// ================== messages array ==================
const nazrul = [
  { timer: '12:00:00 AM', message: ['💞 বন্ধু ও পরিবারকে ভালোবাসুন..!\n🫂 মানুষের সাহায্যে এগিয়ে আসুন..!\n🌈 সব কাজে নিয়ত শুদ্ধ রাখুন..!'] },
  { timer: '1:00:00 AM', message: ['🌟 প্রতিদিন নতুন কিছু ভালো করুন..!\n🕯️ রাতের তাহাজ্জুদ আল্লাহর কাছে প্রিয়..!\n☪️ রমজানের রোজা আপনার আত্মাকে শক্ত করবে..!'] },
  { timer: '2:00:00 AM', message: ['🪷 নিজের চরিত্র সুন্দর করুন, আল্লাহ খুশি হবেন..!\n💎 হারাম থেকে দূরে থাকুন, শান্তি পাবেন..!\n🛡️ ঈমান হলো জীবনের সবচেয়ে বড় সম্পদ..!'] },
  { timer: '3:00:00 AM', message: ['🕋 প্রতিটি কাজ আল্লাহর জন্য করুন..!\n✨ হাসুন, ভালো উদ্দীপনা ছড়িয়ে দিন..!\n📿 নামাজ, দোয়া ও ভালো কাজ—এগুলোই জীবনের শক্তি..!'] },
  { timer: '4:00:00 AM', message: ['🔑 তাওবা করুন, গুনাহ থেকে মুক্তি পাবেন..!\n🍃 ধৈর্য ধরুন, আল্লাহ কঠিন সময় সহজ করবেন..!\n🌈 দয়া ও সহমর্মিতা প্রদর্শন করুন, আল্লাহ আপনাকে সাহায্য করবেন..!'] },
  { timer: '5:00:00 AM', message: ['🕌 জামাতে নামাজ—ঈমানের দৃঢ় ভিত্তি..!\n🌸 বাবা-মায়ের দোয়া নিন, জীবন হবে বরকতপূর্ণ..!\n💡 নেক কাজ করুন, আল্লাহর দৃষ্টি আপনার উপর থাকবে..!'] },
  { timer: '6:00:00 AM', message: ['🕊️ ক্ষমাশীল হোন, মনের শান্তি পাবেন..!\n💞 সদাচরণ করুন, মানুষ আপনার প্রতি আকৃষ্ট হবে..!'] },
  { timer: '7:00:00 AM', message: ['✨ আল্লাহর নাম স্মরণে হৃদয় শান্ত হয়..!\n🙏 নিয়মিত নামাজ—সফল জীবনের চাবিকাঠি..!\n🤲 বেশি বেশি দোয়া করুন, আল্লাহ নিকট শুনুন..!'] },
  { timer: '8:00:00 AM', message: ['🪷 চরিত্রকে সুন্দর করুন, আল্লাহ খুশি হবেন..!\n💎 হারাম থেকে দূরে থাকুন, শান্তি পাবেন..!\n🛡️ ঈমান হলো মানুষের সবচেয়ে বড় সম্পদ..!'] },
  { timer: '9:00:00 AM', message: ['📖 কুরআনের শিক্ষায় জীবন সাজান..!\n🫶 মানুষকে ভালোবাসুন, আল্লাহ খুশি হবেন..!\n🙏 দোয়া কখনো বাদ দেবেন না..!'] },
  { timer: '10:00:00 AM', message: ['✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..!\n🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..!\n🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..!'] },
  { timer: '11:00:00 AM', message: ['🌙 কুরআন পড়ুন, আলোর পথে চলুন..!\n🕊️ ক্ষমাশীল হোন, হৃদয় শান্ত রাখুন..!\n💞 ভালো আচরণ ছড়িয়ে দিন, মানুষ আপনাকে মনে রাখবে..!'] },
  { timer: '12:00:00 PM', message: ['🪷 চরিত্রকে সুন্দর করুন, আল্লাহ খুশি হবেন..!\n💎 হারাম থেকে দূরে থাকুন, শান্তি পাবেন..!\n🛡️ ঈমান হলো জীবনের সবচেয়ে বড় সম্পদ..!'] },
  { timer: '1:00:00 PM', message: ['🌸 বাবা-মায়ের দোয়া নিন..!\n💎 হারাম থেকে নিজেকে বাঁচান..!\n🌈 ভালো কাজে একে অপরকে সাহায্য করুন..!'] },
  { timer: '2:00:00 PM', message: ['🕯️ রাতের তাহাজ্জুদ আল্লাহর নিকটে প্রিয়..!\n☪️ রমজানের রোজা তাকওয়া আনে..!\n🛡️ ঈমান হলো সর্বশ্রেষ্ঠ সম্পদ..!'] },
  { timer: '3:00:00 PM', message: ['🌟 রাতে উঠুন, আল্লাহর রহমত পান..!\n🛎️ গভীর রাতের সেকেন্ডে আল্লাহর স্মরণ করুন..!\n🌙 তাহাজ্জুদ হলো মুমিনের গর্ব..!'] },
  { timer: '4:00:00 PM', message: ['💡 জ্ঞান অর্জন করুন, কারণ জ্ঞান আল্লাহর নিকট প্রিয়..!\n🌸 খারাপ অভ্যাস т্যাগ করুন, ভালো অভ্যাস গড়ে তুলুন..!\n🕋 সদকার মাধ্যমে জীবনকে সুন্দর করুন..!'] },
  { timer: '5:00:00 PM', message: ['✍️ ভালো কথা বলা ইবাদত..!\n🤝 ভ্রাতৃত্ব বজায় রাখুন..!\n🌟 প্রতিটি কাজে নিয়ত শুদ্ধ রাখুন..!'] },
  { timer: '6:00:00 PM', message: ['🍃 সবর করা মুমিনের গুণ..!\n💧 অযু আপনাকে গুনাহ থেকে দূরে রাখে..!\n🪷 নামাজ মুমিনের মিরাজ..!'] },
  { timer: '7:00:00 PM', message: ['🌺 সন্তুষ্টি হলো প্রকৃত সম্পদ..!\n🔑 তাওবা হলো জান্নাতের দরজার চাবি..!\n🪽 এতিমের মাথায় হাত বুলানো রহমত আনে..!'] },
  { timer: '8:00:00 PM', message: ['🌟 মানুষের জন্য দয়া ও সহমর্মিতা প্রদর্শন করুন..!\n🤲 বেশি বেশি আল্লাহর কাছে দোয়া করুন..!\n💞 বন্ধুত্ব ও ভালবাসা হালাল পথে রক্ষা করুন..!'] },
  { timer: '9:00:00 PM', message: ['🕊️ পাপ থেকে দূরে থাকুন..!\n🌙 আল্লাহর রহমতে প্রতিদিন নতুন শুরু করুন..!\n✨ প্রতিটি কাজের শুরুর আগে আল্লাহর নাম স্মরণ করুন..!'] },
  { timer: '10:00:00 PM', message: ['🕋 আল্লাহর পথে জীবনের প্রতিটি পদক্ষেপ রাখুন..!\n📿 সকাল-সন্ধ্যার দোয়া পড়ুন..!\n🌹 অন্যের প্রতি সদাচরণ করুন..!'] },
  { timer: '11:00:00 PM', message: ['💞 রাতের ইবাদত মনের নৈঃশব্দ্য বাড়ায়..!\n🔑 গোপন দোয়া আল্লাহর কাছে প্রিয়..!\n🕊️ রাতের নামাজ পাপ মুছে দেয়..!'] }
];
// =====================================================


// onLoad: চেক চালানো শুরু করবে
module.exports.onLoad = function ({ api }) {
  console.log("[autotime] loaded - checking every", module.exports.config.checkInterval, "ms (Asia/Dhaka)");
  let lastSentKey = null; // duplicate রোধে ব্যবহার

  setInterval(() => {
    try {
      const now = new Date();

      // current hour:minute in Asia/Dhaka (উদাহরণ: "1:00 AM")
      const nowHM = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      }).format(now);

      // normalize scheduled timer by removing seconds -> "1:00:00 AM" => "1:00 AM"
      const nazruld = nazrul.find(item => item.timer.replace(/:\d{2}/, '') === nowHM);
      if (!nazruld) return;

      // বাংলা তারিখ/মাস/বছর/দিন
      const bnDay = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', day: 'numeric' }).format(now);
      const bnMonth = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', month: 'long' }).format(now);
      const bnYear = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', year: 'numeric' }).format(now);
      const bnWeekday = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', weekday: 'long' }).format(now);

      const dhakaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      }).format(now);

      const key = `${nowHM}_${bnDay}_${bnMonth}_${bnYear}`;
      if (lastSentKey === key) return; // একই মিনিটে রি-সেন্ড বন্ধ
      lastSentKey = key;

      const islamicChat =
`╔═❖═❖═❖═❖═❖═❖═╗ 
  ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰   
 ╚═❖═❖═❖═❖═❖═❖═╝
    ╔═✪═🕒═✪═╗
    𝐓𝐢𝐦𝐞: ${dhakaTime}
    ╚════════╝
📅 𝐃𝐚𝐭𝐞: ${bnDay}
📛 𝐃𝐚𝐲: ${bnWeekday}
🗓️ 𝐌𝐨𝐧𝐭𝐡: ${bnMonth}
📆 𝐘𝐞𝐚𝐫: ${bnYear}
━━━━━━━━━━━━━━━
`;

      const finalMessage = islamicChat + '\n' + (Array.isArray(nazruld.message) ? nazruld.message.join('\n') : nazruld.message);

      // যদি config.sendTo-এ থ্রেড আইডি দেয়া থাকে, সেগুলোতে পাঠাও, নাহলে সব গ্রুপে পাঠাও
      if (Array.isArray(module.exports.config.sendTo) && module.exports.config.sendTo.length > 0) {
        module.exports.config.sendTo.forEach(tid => {
          api.sendMessage(finalMessage, tid, (err) => {
            if (err) console.error("[autotime] send error to", tid, err);
          });
        });
      } else {
        // send to all group threads (api.getThreadList used commonly in fb-chat bot frameworks)
        try {
          api.getThreadList(100, null, ['INBOX'], (err, list) => {
            if (err) return console.error("[autotime] getThreadList error:", err);
            list.forEach(thread => {
              if (thread.isGroup || thread.is_group) {
                api.sendMessage(finalMessage, thread.threadID || thread.id, (e) => {
                  if (e) console.error("[autotime] send error", e);
                });
              }
            });
          });
        } catch (e) {
          // কিছু bot-framework এ getThreadList signature আলাদা হলে এখানে কাস্টম লজিক লাগতে পারে
          console.error("[autotime] error while trying to broadcast to groups:", e);
        }
      }

    } catch (error) {
      console.error("[autotime] interval error:", error);
    }
  }, module.exports.config.checkInterval || 60 * 1000);
};


// run(command) — হাতে কলমে পাঠাতে চাইলে: .autotime (আর তোমার ফ্রেমওয়ার্ক অনুযায়ী run signature বদলাতে হবে)
module.exports.run = async function ({ api, event }) {
  try {
    const now = new Date();
    const dhakaTime = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', hour12: true, hour: 'numeric', minute: '2-digit' }).format(now);
    const bnDay = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', day: 'numeric' }).format(now);
    const bnMonth = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', month: 'long' }).format(now);
    const bnYear = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', year: 'numeric' }).format(now);
    const bnWeekday = new Intl.DateTimeFormat('bn-BD', { timeZone: 'Asia/Dhaka', weekday: 'long' }).format(now);

    const header = `╔═❖═ 𝗧𝗘𝗦𝗧 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 ═❖═╗\nTime: ${dhakaTime}\nDate: ${bnDay} ${bnMonth} ${bnYear} (${bnWeekday})\n━━━━━━━━━━━━━━━\n`;
    // default: send the 12:00 AM message as a sample
    const sample = nazrul[0].message.join('\n');
    api.sendMessage(header + sample, event.threadID);
  } catch (e) {
    console.error(e);
  }
};
