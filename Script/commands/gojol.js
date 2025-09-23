const fs = require("fs");
const request = require("request");

let lastPlayed = -1;

module.exports.config = {
  name: "gojol",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Mohammad Akash",
  description: "Play random gojol with prefix command",
  commandCategory: "music",
  usages: "[prefix]gojol",
  cooldowns: 5
};

// সব গজলের লিংক এখানে
const gojolLinks = [
  "https://drive.google.com/uc?export=download&id=1l7tKijhgLBVGfD-ovopovrpQuQf_cExe",
  "https://drive.google.com/uc?export=download&id=1MWH-z11v1l7dF8WV0zb5Ff4A4BlxXOdU",
  "https://drive.google.com/uc?export=download&id=1rmiXxL22rx8sRESpGbrjAGYygmhGUWEB",
  "https://drive.google.com/uc?export=download&id=16I-3dKv5ZagXJ5uL1D_ulOu4fh-h2-3R",
  "https://drive.google.com/uc?export=download&id=1LQ7PI1Ef4tD8BGwM-c0VnEx-I7uyU2e-",
  "https://drive.google.com/uc?export=download&id=1sQFhLhvuhn5OmNjbllP808ELwtFAYL6D",
  "https://drive.google.com/uc?export=download&id=1kuFJQtyqiPih4PWg0q8SSMOirEjqtLzdN",
  "https://drive.google.com/uc?export=download&id=190itIp-2O2ZOVa8XAEqUTz4NbkzY_R3o",
  "https://drive.google.com/uc?export=download&id=1dGLFoxJUa2HE0CWngbDAnrhiP12TYhff",
  "https://drive.google.com/uc?export=download&id=1vdwJinjLrtabGxQyu4VaxI8T7WJJvixt",
  "https://drive.google.com/uc?export=download&id=1XA18cHeZbr0u9_T8QACuy5DNZCdRyg7J",
  "https://drive.google.com/uc?export=download&id=1gCmvYwAX8ggyrLw7Seq8B2sbCwW4Ocy0",
  "https://drive.google.com/uc?export=download&id=1itznwCuLiZqwocudXBWVQePCSPbquEYh",
  "https://drive.google.com/uc?export=download&id=1Nl4OCaXjtwuBm73OJ4qPfiDS3bcGSXtpOI",
  "https://drive.google.com/uc?export=download&id=1B27F4dZo1JBSqQ_HVuHLrEqPw9Ad28OI",
  "https://drive.google.com/uc?export=download&id=1cSEzTlnIc6xDOVDVB-8gRrbFa6z0xw6L",
  "https://drive.google.com/uc?export=download&id=1kJ9h7s_8eB3zzthy9z_cL2eLFcOzcYbo",
  "https://drive.google.com/uc?export=download&id=1gAsrNQnjh1Y1itti_Y6YWnsUKpUMbrcF",
  "https://drive.google.com/uc?export=download&id=1THB3bXJzvapoSNO-d-1-1rsu44QgQTJW",
  "https://drive.google.com/uc?export=download&id=1tCfu-9lIlLWQVMvhj3-u8r8tCGJboLJK"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  if (gojolLinks.length === 0) {
    return api.sendMessage("❌ কোনো গজল লিস্টে নেই!", threadID, messageID);
  }

  // React দেখাবে processing এর জন্য
  api.setMessageReaction("⌛", messageID, () => {}, true);

  // র‍্যান্ডম গজল সিলেক্ট করবে (একইটা বারবার না দিতে চেষ্টা করবে)
  let index;
  do {
    index = Math.floor(Math.random() * gojolLinks.length);
  } while (index === lastPlayed && gojolLinks.length > 1);

  lastPlayed = index;
  const url = gojolLinks[index];
  const filePath = `${__dirname}/cache/gojol_${index}.mp3`;

  // Download করে পাঠানো
  request(encodeURI(url))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage({
        body: "🕌 তোমার জন্য একটি গজল:",
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        // পাঠানোর পর ফাইল ডিলিট করবে
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }, messageID);
    })
    .on("error", (err) => {
      console.error("Download error:", err);
      api.sendMessage("❌ গজল ডাউনলোড করতে সমস্যা হয়েছে!", threadID, messageID);
    });
};
