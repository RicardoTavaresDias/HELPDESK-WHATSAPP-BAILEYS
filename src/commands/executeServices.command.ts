import db from "@/config/postgres"
import { Type } from "@google/genai"

async function executeServices (searchServices: string) {
  console.log(searchServices)
  try{
    const respoonse = await db.query(`SELECT id, title_service FROM "services" WHERE LOWER(title_service) LIKE LOWER($1)`, [`'%${searchServices}%'`])
    return respoonse.rows
  }catch (error: any) {
    return error.message
  }
}

const executeServicesProperties = {
  name: 'executeServices',
  description: `
    Busca serviços se existe o nome relacionado a titulo.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      searchServices: {
        type: Type.STRING,
        description: `
          Informar um nome ou tipo relacionado a serviço que usuario pode informar, será realizado uma busca na tabela serviços pelo title do serviço.
        `.trim()
      }
    },
    required: ['searchServices']
  }
}

export { executeServices, executeServicesProperties }