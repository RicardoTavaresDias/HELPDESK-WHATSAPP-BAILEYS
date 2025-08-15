import makeWASocket, { DisconnectReason, WASocket} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { geminaiAI } from "./gemini.services"
import { usePostgreSQLAuthState } from "postgres-baileys"; 
import db from '@/config/postgres.config';
import { WebSocketServer } from 'ws'

let removeSession: () => Promise<void>
let sock: WASocket | null = null
let reconnecting = false

const ws = new WebSocketServer({ port: 3300 })

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

// Envia para todos clientes conectados
function broadcast(message: any) {
  ws.clients.forEach((client) => {
    client.send(JSON.stringify(message))
  })
}

// Conexão 
function connection () {
  return new Promise((resolve, reject) => {
    if(!sock) return
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if(update.qr) {
        resolve(update.qr)
      }

      if (connection === 'open') {
        broadcast({ type: 'open', data: 'connection' })
        resolve("connection")
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut      
       // broadcast({ type: 'message', data: 'Conexão encerrada. Reconectando...' }) 
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
    broadcast({ type: 'close', data: 'disconnected' }) 
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

    const jid = message.key.remoteJid
    if(!jid || !sock) return
   
    (async () => {
      const replayAI = await geminaiAI(text as string)
      await sock.sendMessage(jid, {  text: replayAI || "um minuto" })
    })()
  })
}

export default bootWhatsappBaileysIA