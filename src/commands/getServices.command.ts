import db from "@/config/postgres"
import { Type } from "@google/genai"

async function getServices () {
  try{
    const respoonse = await db.query(`SELECT id, title_service FROM "services"`)
    console.log(respoonse.rows)
    return JSON.stringify(respoonse.rows)
  }catch (error: any) {
    return JSON.stringify(error.message)
  }
}

const getServicesProperties = {
  name: 'getServices',
  description: `
    Lista todos os serviços com id e title_services.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: []
  }
}

export { getServices, getServicesProperties }