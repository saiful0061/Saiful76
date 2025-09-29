const nazrul = [
  {
    timer: '12:00:00 AM',
message: ['hi'], 
},
{
timer: '1:00:00 AM',
message: ['hi']
},
{
timer: '2:00:00 AM',
message: ['hi']
},
{
timer: '3:00:00 AM',
message: ['hi']
},
{
timer: '4:00:00 AM',
message: ['hi']
},
{
timer: '5:00:00 AM',
message: ['hi']
},
{
timer: '6:00:00 AM',
message: ['hi']
},
{
timer: '7:00:00 AM',
message: ['h']
},
{
timer: '8:00:00 AM',
message: ['hi']
},
{
timer: '9:00:00 AM',
message: ['hi']
},
{
timer: '10:00:00 AM',
message: ['hi']
},
{
timer: '11:00:00 AM',
message: ['hi']
},
{
timer: '12:00:00 PM',
message: ['hi']
},
{
timer: '1:00:00 PM',
message: ['hi']
},
{
timer: '2:00:00 PM',
message: ['hi']
},
{
timer: '3:00:00 PM',
message: ['hi']
},
{
timer: '4:00:00 PM',
message: ['hi']
},
{
timer: '5:00:00 PM',
message: ['hi']
},
{
timer: '6:00:00 PM',
message: ['hi]
},
{
timer: '7:00:00 PM',
message: ['hi']
},
{
timer: '8:00:00 PM',
message: ['hi']
},
{
timer: '9:00:00 PM',
message: ['hi']
},
{
timer: '10:00:00 PM',
message: ['hi']
},
{
timer: '11:00:00 PM',
message: ['hi']
  }
 
];

module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  permission: 0,
  credits: "nazrul",
  description: "প্রতি ঘন্টায় ইসলামিক বার্তা পাঠায় (বাংলা তারিখ সহ)",
  prefix: true,
  commandCategory: "user",
  usages: "",
  cooldowns: 5
};

module.exports.onLoad = ({ api }) => {
  setInterval(() => {
    const now = new Date(Date.now() + 6 * 60 * 60 * 1000); 
    const fullTime = now.toLocaleTimeString('en-US', { hour12: true }); 
    const matchTime = fullTime;

    const nazrula = now.getDate(); // 13
    const nazrulh = now.toLocaleString('bn-BD', { month: 'long' }); 
    const nazrulr = now.getFullYear(); 
    const nazruly = now.toLocaleString('bn-BD', { weekday: 'long' }); 
    const nazrulk = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); 

    const islamickChat =
`======= 𝗧𝗜𝗠𝗘 =======
📅 𝐃𝐚𝐭𝐞: ${nazrula}
📛 𝐃𝐚𝐲: ${nazruly}
🗓️ 𝐌𝐨𝐧𝐭𝐡: ${nazrulh}
📆 𝐘𝐞𝐚𝐫𝐬: ${nazrulr}
🕒 𝐓𝐢𝐦𝐞: ${nazrulk}
━━━━━━━━━━━━━━━`;

    const nazruld = nazrul.find(item => item.timer === matchTime);
    if (nazruld) {
      const Mdnazrul = `${islamickChat}\n${nazruld.message.join("\n")}\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐡𝐚𝐭`;
      global.data.allThreadID.forEach(threadID => {
        api.sendMessage(Mdnazrul, threadID);
      });
    }
  }, 1000); 
};

module.exports.run = () => {};
