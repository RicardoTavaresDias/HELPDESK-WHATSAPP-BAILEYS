import makeWASocket, { DisconnectReason, WASocket} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { geminaiAI } from "./gemini.services"
import { usePostgreSQLAuthState } from "postgres-baileys"; 
import db from '@/config/postgres.config';

let removeSession: () => Promise<void>
let sock: WASocket | null = null
let reconnecting = false

async function bootWhatsappBaileysIA () {
  const { state, saveCreds, deleteSession } = await usePostgreSQLAuthState(db, 'auth_info')
  removeSession = deleteSession

  sock =  makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: require('pino')({ level: 'silent' })
  })

  sendMessage()
  saveAuthInfo(saveCreds)
  
  return connection()
}

// Salva credenciais sempre que atualizar
function saveAuthInfo (saveCreds: () => Promise<void>) {
  if(!sock) return
  sock.ev.on("creds.update", saveCreds)
}

// Conexão 
function connection () {
  return new Promise((resolve, reject) => {
    if(!sock) return
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if(update.qr) {
        resolve(update.qr)
        //console.log('QR code atualizado')
      }

      if (connection === 'open') {
        resolve('Conectado ao WhatsApp')
        console.log("Conectado")
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('Conexão encerrada. Reconectando...')
        await reconnect(shouldReconnect)
      } 
      
    })
  })
}

 // reconexão
 async function reconnect (shouldReconnect: boolean) {
  if (reconnecting) return
  reconnecting = true

  if (shouldReconnect) {
    // Realiza reconexão após perca de conexão.
    await bootWhatsappBaileysIA()
  }else {
    // Remove a pasta auth_info e reconecta novamente no baileys
    if (removeSession) await removeSession()
    sock = null
    console.log("Conexão encerrada, escanear QRCODE novamente.")
  }

  reconnecting = false;
}

// Escutar mensagens
function sendMessage () {
  if(!sock) return

  sock.ev.on("messages.upsert", async (m) => {
    const message = m.messages[0]
    if (message.key.fromMe) return // Evita responder mensagens enviadas pelo próprio bot
    if (message.key.remoteJid?.endsWith('@g.us')) return; // Ignorar mensagens de grupos

    // Extrair texto da mensagem
    const text = message.message?.conversation || message.message?.extendedTextMessage

    if(!text || !sock) return
    //@ts-ignore
    await sock.sendMessage(message.key.remoteJid, {  text: await geminaiAI(text) })
  })
}

export default bootWhatsappBaileysIA