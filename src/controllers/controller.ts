import bootWhatsappBaileys  from "@/services/whatsappService";
import { Request, Response } from "express";
import { main } from "@/services/gemini.js";
import Repository from "@/repositories/repository";

export class ChatbotController {
  repository = new Repository()

  get = (request: Request, response: Response) => {
    try {
      const result = bootWhatsappBaileys.getQRCode()
      response.status(200).json({ message: result })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: error })
    }
  }

  getDatabase = async (request: Request, response: Response) => {
    // Get users database
    const result = await this.repository.users()

    // resposta AI
    //const result = await main()
    response.status(200).json({ response: result })
  }
}