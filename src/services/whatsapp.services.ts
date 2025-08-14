import makeWASocket, { DisconnectReason, WASocket} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { geminaiAI } from "./gemini.services"

import { usePostgreSQLAuthState } from "postgres-baileys"; 
import db from '@/config/postgres.config';

class BootWhatsappBaileys {
  private sock: WASocket | null = null
  private deleteSession: (() => Promise<void>) | undefined
  private reconnecting = false;

  async initial () {
    const { state, saveCreds, deleteSession } = await usePostgreSQLAuthState(db, 'auth_info')

    this.deleteSession = deleteSession

    this.sock =  makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: require('pino')({ level: 'silent' })
    })

    this.sendMessage()
    this.saveAuthInfo (saveCreds)
    return this.connection()
  }

  // Escutar mensagens
  private sendMessage () {
    if(!this.sock) return

    this.sock.ev.on("messages.upsert", async (m) => {
      const message = m.messages[0]
      if (message.key.fromMe) return // Evita responder mensagens enviadas pelo próprio bot
      if (message.key.remoteJid?.endsWith('@g.us')) return; // Ignorar mensagens de grupos

      // Extrair texto da mensagem
      const text = message.message?.conversation || message.message?.extendedTextMessage

      if(!text) return
      //@ts-ignore
      await this.sock?.sendMessage(message.key.remoteJid, {  text: await geminaiAI(text) })
    })
  }

  // Salva credenciais sempre que atualizar
  private saveAuthInfo (saveCreds: () => Promise<void>) {
    if(!this.sock) return
    this.sock.ev.on("creds.update", saveCreds)
  }

  // Conexão 
  private connection () {
    return new Promise((resolve, reject) => {
      this.sock?.ev.on('connection.update', async (update) => {
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
          await this.reconnect(shouldReconnect)
        } 
        
      })
    })
  }

  // reconexão
  private async reconnect (shouldReconnect: boolean) {
    if (this.reconnecting) return
    this.reconnecting = true

    if (shouldReconnect) {
      // Realiza reconexão após perca de conexão.
      await this.initial()
    }else {
      // Remove a pasta auth_info e reconecta novamente no baileys
      if (this.deleteSession) await this.deleteSession()
      this.sock = null
      console.log("Conexão encerrada, escanear QRCODE novamente.")
    }

    this.reconnecting = false;
  }
}

const bootWhatsappBaileys = new BootWhatsappBaileys()
export default bootWhatsappBaileys