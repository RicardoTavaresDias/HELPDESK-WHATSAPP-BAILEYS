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

/*
  QUERY BANCO DE DADOS POSTGRESS RENDER
  
  import client from "@/config/postgres.config";

  await client.connect();
  const res = await client.query('SELECT * FROM called');
  console.log(res.rows); // resultado da query

*/