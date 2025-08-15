import { geminaiAI } from "@/services/gemini.services";
import bootWhatsappBaileysIA  from "@/services/whatsapp.services";
import { Request, Response } from "express";

import Repository from "@/repositories/repository";

export class ChatbotController {
  async get (request: Request, response: Response) {
    try {
      const result = await bootWhatsappBaileysIA()
      response.status(200).json({ message: result })
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: error })
    }
  }

  async show (request: Request, response: Response) {
    try {
      const repository = new Repository()
      response.status(200).json(await repository.calledID('77'))
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: error })
    }
  }
}


//const result = await geminaiAI(request.body.question)
//console.log(result)
//return