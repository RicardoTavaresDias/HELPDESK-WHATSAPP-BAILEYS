import bootWhatsappBaileys  from "@/services/whatsappService";
import { Request, Response } from "express";

export class ChatbotController {
  get (request: Request, response: Response){
    try {
      const result = bootWhatsappBaileys.getQRCode()
      response.status(200).json({ message: result })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: error })
    }
  }
}