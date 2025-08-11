import { geminaiAI } from "@/services/gemini.services";
import bootWhatsappBaileys  from "@/services/whatsapp.services";
import { Request, Response } from "express";

import Repository from "@/repositories/repository";

export class ChatbotController {
  async get (request: Request, response: Response) {
    //const result = await geminaiAI(request.body.question)
    //console.log(result)
    const repository = new Repository()
    response.status(200).json(await repository.calledID('77'))
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