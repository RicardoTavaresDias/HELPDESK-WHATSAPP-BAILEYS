import bootWhatsappBaileysIA  from "@/services/whatsapp.services";
import { Request, Response, NextFunction } from "express";

export class ChatbotController {
  async get (request: Request, response: Response, next: NextFunction) {
    try {
      const result = await bootWhatsappBaileysIA()
      response.status(200).json({ message: result })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}