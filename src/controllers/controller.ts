import { geminaiAI } from "@/services/gemini.services";
import bootWhatsappBaileys  from "@/services/whatsapp.services";
import { Request, Response } from "express";

export class ChatbotController {
  async get (request: Request, response: Response) {
   const result = await geminaiAI(request.body.question)
    console.log(result)
    return
    try {
      const result = bootWhatsappBaileys.getQRCode()
      response.status(200).json({ message: result })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: error })
    }
  }
}