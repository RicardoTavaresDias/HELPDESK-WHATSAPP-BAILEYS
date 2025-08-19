import makeWASocket, { DisconnectReason, WASocket} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { geminaiAI } from "./gemini.services"
import { usePostgreSQLAuthState } from "postgres-baileys"; 
import db from '@/config/postgres';
import { ws } from '@/server';
import PQueue from "p-queue"

let removeSession: () => Promise<void>
let sock: WASocket | null = null
let reconnecting = false
const cacheVerifiedUsers = new Map<string, { valid: boolean, expiresAt: number }>() 

 // Adicionar mensagem à fila controlando await varios requisições
const messageQueue = new PQueue({ concurrency: 5 });

async function bootWhatsappBaileysIA () {
  const { state, saveCreds, deleteSession } = await usePostgreSQLAuthState(db, 'auth_info')
  removeSession = deleteSession

  sock =  makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: require('pino')({ level: 'silent' }),
    connectTimeoutMs: 60000, // 60 segundos
    markOnlineOnConnect: false,   // reduz tráfego inicial
    syncFullHistory: false        // evita sync pesado ao conectar
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
    await new Promise(r => setTimeout(r, 3000)) // espera 3s antes de reconectar

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

    messageQueue.add(() => setMessage({ jid, sockUpsert: sock!, text }))
  })
}

 // Envio de mensagem para Whatsapp
async function setMessage ({ jid, sockUpsert, text }: { jid: string, sockUpsert: WASocket, text: any }) {
  try {
    const validetion = await verifyUserWhatsapp({ jid, sockUpsert })
    if(!validetion) return

    await sock?.sendMessage(jid, { text: "🧠 Um minuto, analisando a informação..." })

    const replayAI = await geminaiAI(jid.split("@")[0], text)
    //@ts-ignore
    await sockUpsert.sendMessage(jid, {  text: replayAI || await geminaiAI(jid.split("@")[0], "ok") })
  } catch (error) {
    console.error('Erro ao processar mensagem:', error)
  }
}

// Seguraça verificando se usurio esta cadastrado no sistema para uso Whatsapp
async function verifyUserWhatsapp ({ jid, sockUpsert }: { jid: string, sockUpsert: WASocket }) {
  const phoneUser = jid?.split("@")[0]

  if (!cacheVerifiedUsers.has(phoneUser) || cacheVerifiedUsers.get(phoneUser)!.expiresAt < Date.now()){
    const existUserPhone = await db.query(`SELECT * FROM "user" WHERE phone = $1`, [phoneUser])
    const isValid = existUserPhone.rows.length > 0

    cacheVerifiedUsers.set(phoneUser, { 
      valid: isValid, 
      expiresAt: isValid ? Date.now() + 10 * 60 * 1000 : Date.now() + 1 * 60 * 1000 
    }) // expiresAt cache 10 min se válido, 1 min se inválido
  }

  if (cacheVerifiedUsers.get(phoneUser)?.valid === false) {
    await sockUpsert.sendMessage(jid, { 
      text: "Telefone não cadastrado no sistema, realizar cadastro do telefone no seu perfil de acesso, para ter melhor experiencia com suporte Whatsapp." 
    })
  }

  return cacheVerifiedUsers.get(phoneUser)?.valid
}

export default bootWhatsappBaileysIA