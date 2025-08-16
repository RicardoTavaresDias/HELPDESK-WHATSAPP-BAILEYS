import { Type } from "@google/genai"
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { dataTypeCreateCalled } from "@/types/functionCall-args.reponse";
import { app } from "@/config/axios";

async function executeCreateCalled (data: dataTypeCreateCalled) {
  const token = jwt.sign({ user: { role: 'admin' }}, env.SECRET, { expiresIn: "1d" })
  
  try {
    const response = await app.post("/calleds", {
      idCustomer: data.idCustomer,
      titleCalled: data.titleCalled,
      description: data.description,
      dateCustomer: data.dateCustomer,
      hourCustomer: data.hourCustomer,
      idServices: [{ id: data.idServices }]
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data.message
  } catch (error) {
    console.log(error)
    return error
  }
}

const executeCreateCalledProperties = {
  name: 'executeCreateCalled',
  description: `
    Cria um chamado com os dados fornecidos pelo cliente.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      data: {
        type: Type.OBJECT,
        description: "Dados necessários para criar um chamado.",
        properties: {
          idCustomer: { 
            type: Type.STRING, 
            description: "ID do cliente" 
          },
          titleCalled: { 
            type: Type.STRING, 
            description: "Título do chamado." 
          },
          description: { 
            type: Type.STRING, 
            description: "Descrição detalhada do chamado." 
          },
          dateCustomer: { 
            type: Type.STRING, 
            description: "Data informada pelo cliente (formato YYYY-MM-DD)." 
          },
          hourCustomer: { 
            type: Type.STRING, 
            description: "Hora informada pelo cliente (formato HH:MM). minuto sempre 00" 
          },
          idServices: { 
            type: Type.STRING, 
            description: "ID do serviço relacionado." 
          }
        },
        required: [
          'idCustomer',
          'titleCalled',
          'description',
          'dateCustomer',
          'hourCustomer',
          'idServices'
        ]
      }
    },
    required: ['data'] 
  }
}

export { executeCreateCalled, executeCreateCalledProperties }