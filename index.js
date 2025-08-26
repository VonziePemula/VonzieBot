const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")
const P = require("pino")
const fs = require("fs")
const { exec } = require("child_process")
const chalk = require("chalk")
const path = require("path")

// import case.js
const { handleCase } = require("./case")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: "fatal" }))
        },
        browser: ["VonzieBot", "Chrome", "5.0"]
    })

    sock.ev.on("creds.update", saveCreds)

    // Pairing code system
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER || "" // bisa edit langsung atau pakai env
        if (!phoneNumber) {
            console.log(chalk.red("❌ Masukkan nomor WA di PHONE_NUMBER env / variable!"))
            process.exit(0)
        }
        const code = await sock.requestPairingCode(phoneNumber)
        console.log(chalk.green(`🔗 Pairing Code untuk ${phoneNumber}: ${code}`))
    }

    // Handler pesan masuk
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return
        const m = messages[0]
        if (!m.message) return
        try {
            await handleCase(sock, m)
        } catch (err) {
            console.error("❌ Error di handler:", err)
        }
    })

    // Notif connect/disconnect
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update
        if (connection === "close") {
            console.log(chalk.red("❌ Koneksi terputus, mencoba ulang..."))
            startBot()
        } else if (connection === "open") {
            console.log(chalk.green("✅ Bot berhasil terhubung!"))
        }
    })
}

startBot()
