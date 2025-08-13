import makeWASocket, { DisconnectReason, WASocket} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { geminaiAI } from "./gemini.services"

import { usePostgreSQLAuthState } from "postgres-baileys"; 
import db from '@/config/postgres.config';

class BootWhatsappBaileys {
  private sock: WASocket | null = null
  private QrCode: string | null = null
  private deleteSession: (() => Promise<void>) | undefined

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
    this.sock?.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('Conexão encerrada. Reconectando...')
        await this.reconnect(shouldReconnect)

      } else if (connection === 'open') {
        console.log('Conectado com sucesso ao WhatsApp')
        this.QrCode = null
      }

      if(update.qr) {
        this.QrCode = update.qr
        console.log('QR code atualizado')
      }
    })
  }

  // reconexão
  private async reconnect (shouldReconnect: boolean) {
    if (shouldReconnect) {
      // Realiza reconexão após perca de conexão.
      await this.initial()
    }else {
      // Remove a pasta auth_info e reconecta novamente no baileys
      //@ts-ignore
      this.deleteSession()
      this.QrCode = null
      console.log("Conexão encerrada, escanear QRCODE novamente.")
      await this.initial()
    }
    return
  }

  getQRCode () {
    return this.QrCode
  }
}

const bootWhatsappBaileys = new BootWhatsappBaileys()
export default bootWhatsappBaileys