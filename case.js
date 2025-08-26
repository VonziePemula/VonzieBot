// case.js
const { proto } = require("@whiskeysockets/baileys")

/**
 * Handler command bot
 * @param {import("@whiskeysockets/baileys").WASocket} sock
 * @param {import("@whiskeysockets/baileys").proto.IWebMessageInfo} m
 */
async function handler(sock, m) {
    try {
        const body = m.message?.conversation 
                  || m.message?.extendedTextMessage?.text 
                  || m.message?.imageMessage?.caption 
                  || ""

        const sender = m.key.participant || m.key.remoteJid
        const isGroup = sender.endsWith("@g.us")
        const command = body.startsWith("!") ? body.slice(1).split(" ")[0].toLowerCase() : null
        const args = body.split(" ").slice(1)
        
        // Kalau bukan command, keluar
        if (!command) return

        console.log(`[CMD] ${command} from ${sender}`)

        switch (command) {
            case "menu":
                await sock.sendMessage(sender, {
                    text: `👋 Hai, ini menu bot!
                    
*✨ Menu Utama*
1. !sticker (balas gambar)
2. !ping
3. !owner
4. !about
5. !help`,
                }, { quoted: m })
                break

            case "ping":
                await sock.sendMessage(sender, { text: "🏓 Pong!" }, { quoted: m })
                break

            case "sticker":
            case "s":
                if (m.message?.imageMessage) {
                    const buffer = await sock.downloadMediaMessage(m)
                    await sock.sendMessage(sender, { 
                        sticker: buffer 
                    }, { quoted: m })
                } else {
                    await sock.sendMessage(sender, { text: "⚠️ Reply gambar dengan `!sticker`" }, { quoted: m })
                }
                break

            case "owner":
                await sock.sendMessage(sender, { text: "👑 Owner: wa.me/628xxxxxxx" }, { quoted: m })
                break

            case "about":
                await sock.sendMessage(sender, { text: "🤖 Bot WhatsApp Base by Vonzie\nMenggunakan Baileys + Pairing Code" }, { quoted: m })
                break

            case "help":
                await sock.sendMessage(sender, { text: "📖 Ketik !menu untuk melihat daftar fitur" }, { quoted: m })
                break

            default:
                await sock.sendMessage(sender, { text: `❓ Command *${command}* tidak dikenal.` }, { quoted: m })
                break
        }
    } catch (e) {
        console.error("Error in case.js:", e)
    }
}

module.exports = handler
