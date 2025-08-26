const { default: makeWASocket, useMultiFileAuthState, Browsers } = require("@adiwajshing/baileys")
const pino = require("pino")
const fs = require("fs-extra")
const { handleCommand } = require("./case")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: Browsers.macOS("Vonzie Bot")
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") startBot()
    else if (connection === "open") console.log("✅ Bot connected")
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const from = m.key.remoteJid
    const isGroup = from.endsWith("@g.us")
    const type = Object.keys(m.message)[0]
    const text = type === "conversation" ? m.message.conversation : (m.message.extendedTextMessage?.text || "")
    if (!text) return

    await handleCommand(sock, m, text, from, isGroup)
  })
}

startBot()
