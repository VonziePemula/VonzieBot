// case.js
const fs = require("fs");
const path = require("path");
const { proto } = require("@whiskeysockets/baileys");

module.exports = async function caseHandler(sock, m, chatUpdate, store) {
    try {
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");
        const sender = isGroup ? m.key.participant : m.key.remoteJid;
        const type = Object.keys(m.message)[0];
        const body = 
            (type === "conversation" && m.message.conversation) ? m.message.conversation : 
            (type === "imageMessage" && m.message.imageMessage.caption) ? m.message.imageMessage.caption : 
            (type === "videoMessage" && m.message.videoMessage.caption) ? m.message.videoMessage.caption : 
            (type === "extendedTextMessage" && m.message.extendedTextMessage.text) ? m.message.extendedTextMessage.text : 
            (type === "buttonsResponseMessage" && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : 
            (type === "listResponseMessage" && m.message.listResponseMessage.singleSelectReply.selectedRowId) ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
            "";

        const command = body.startsWith("!") ? body.slice(1).trim().split(" ")[0].toLowerCase() : "";
        const args = body.trim().split(/ +/).slice(1);

        // Menu utama (pakai thumbnail foto atau sticker pack)
        if (command === "menu") {
            let menuText = `
╭───⟨ *🤖 WHATSAPP BOT MENU* ⟩───╮
│ 🗂️  *Main Commands*
│ • !ping
│ • !sticker
│ • !owner
│ • !help
│
│ 🎉  *Fun Commands*
│ • !joke
│ • !quote
│
│ 🛠️  *Tools*
│ • !toimg (reply sticker)
│ • !tomp3 (reply video)
│
│ 🔑  *System*
│ • !pair
│ • !status
╰───────────────────────────────╯
`;

            let thumbPath = path.join(__dirname, "thumb.jpg"); // foto thumbnail
            let buffer = fs.readFileSync(thumbPath);

            await sock.sendMessage(from, {
                image: buffer,
                caption: menuText,
                footer: "Vonzie Bot WhatsApp • Pairing System",
                buttons: [
                    { buttonId: "!ping", buttonText: { displayText: "📡 Ping" }, type: 1 },
                    { buttonId: "!sticker", buttonText: { displayText: "✨ Sticker" }, type: 1 },
                    { buttonId: "!owner", buttonText: { displayText: "👑 Owner" }, type: 1 }
                ],
                headerType: 4
            }, { quoted: m });
        }

        // Contoh command ping
        if (command === "ping") {
            await sock.sendMessage(from, { text: "Pong! 🏓" }, { quoted: m });
        }

        // Convert ke sticker
        if (command === "sticker") {
            if ((type === "imageMessage") || (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)) {
                let media = await sock.downloadMediaMessage(
                    m.message.imageMessage ? m : { message: m.message.extendedTextMessage.contextInfo.quotedMessage }
                );
                await sock.sendMessage(from, { sticker: media }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: "Reply gambar dengan *!sticker* untuk buat sticker" }, { quoted: m });
            }
        }

        // Owner
        if (command === "owner") {
            await sock.sendMessage(from, { text: "👑 Owner: wa.me/628xxxxxxxxxx" }, { quoted: m });
        }

    } catch (err) {
        console.error("Error in case.js:", err);
    }
};
