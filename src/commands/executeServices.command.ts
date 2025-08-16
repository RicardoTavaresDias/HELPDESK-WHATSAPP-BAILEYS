import db from "@/config/postgres"
import { Type } from "@google/genai"

async function executeServices () {
  try{
    const respoonse = await db.query(`SELECT id, title_service FROM "services"`)
    console.log(respoonse.rows)
    return JSON.stringify(respoonse.rows)
  }catch (error: any) {
    return JSON.stringify(error.message)
  }
}

const executeServicesProperties = {
  name: 'executeServices',
  description: `
    Lista todos os serviços com id e title_services.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: []
  }
}

export { executeServices, executeServicesProperties }