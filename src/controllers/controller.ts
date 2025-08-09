import bootWhatsappBaileys  from "@/services/whatsappService";
import { Request, Response } from "express";
import client from "@/config/postgres.config";

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

  async getDatabase (request: Request, response: Response) {
    await client.connect();
    const res = await client.query('SELECT id, name, email, role FROM "user"');
    response.status(200).json(res.rows)
  }
}