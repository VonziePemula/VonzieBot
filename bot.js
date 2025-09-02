// bot.js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// =============== Helper ===============
function question(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

// =============== Main ===============
async function clientstart() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    printQRInTerminal: false,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      );
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    },
    version,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    logger: pino({ level: "silent" }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino().child({
        level: "silent",
        stream: "store",
      })),
    }
  });

  conn.ev.on("creds.update", saveCreds);

  // =============== Pairing Code ===============
  if (!conn.authState.creds.registered) {
    const phoneNumber = await question("📱 Masukin nomor WhatsApp kamu (contoh: 62xxx):\n");
    const code = await conn.requestPairingCode(phoneNumber.trim());
    console.log(chalk.green.bold(`🔑 Pairing Code: ${code}`));
  }

  // =============== Connection Update ===============
  conn.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      console.log(chalk.red("❌ Koneksi terputus, mencoba reconnect..."));
      clientstart();
    } else if (connection === "open") {
      console.log(chalk.green("✅ Bot berhasil connect ke WhatsApp!"));
    }
  });

  // =============== Message Handler (Case) ===============
  conn.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    const from = m.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
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

    try {
    const mode = {
key: {
participant: `13135559098@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "13135559098@s.whatsapp.net"
} : {}),
id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
},
message: {
contactMessage: {
displayName: `Masih Pemula`,
vcard: true,
thumbnailUrl: `https://k.top4top.io/p_3528gs2jm0.png`,
sendEphemeral: true
}},
status: 1,
participant: "13135559098@s.whatsapp.net"
}
      // 🟢 Status
      if (command === "status" || command === "pair") {
        const connStatus = conn?.ws?.readyState === 1 ? "🟢 CONNECTED" : "🔴 DISCONNECTED";
        await conn.sendMessage(from, { text: `📡 Bot Status: ${connStatus}` }, { quoted: m });
      }

      // 📜 Menu
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
Vonzie Bot • Pairing System
`;

        await conn.sendMessage(from, {
          image: buffer,
          caption: menuText,
          footer: "Vonzie Bot WhatsApp • Secret Thumbnail 🔒",
          buttons: [
            { buttonId: "!ping", buttonText: { displayText: "📡 Ping" }, type: 1 },
            { buttonId: "!sticker", buttonText: { displayText: "✨ Sticker" }, type: 1 },
            { buttonId: "!owner", buttonText: { displayText: "👑 Owner" }, type: 1 }
          ],
          headerType: 4
        }, { quoted: mode });
      }

      // 📡 Ping
      if (command === "ping") {
        await conn.sendMessage(from, { text: "Pong! 🏓" }, { quoted: m });
      }

      // 🎭 Sticker
      if (command === "sticker") {
        if ((type === "imageMessage") || (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage)) {
          let media = await downloadMediaMessage(
            m.message.imageMessage ? m : { message: m.message.extendedTextMessage.contextInfo.quotedMessage },
            "buffer",
            {}
          );
          await conn.sendMessage(from, { sticker: media }, { quoted: m });
        } else {
          await conn.sendMessage(from, { text: "Reply gambar dengan *!sticker* untuk buat sticker" }, { quoted: m });
        }
      }

      // 👑 Owner
      if (command === "owner") {
        await conn.sendMessage(from, { text: "👑 Owner: wa.me/628xxxxxxxxxx" }, { quoted: m });
      }

    } catch (err) {
      console.error("❌ Error in case handler:", err);
    }
  });
}

clientstart();
