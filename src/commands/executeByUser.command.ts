import db from "@/config/postgres"
import { Type } from "@google/genai"

async function executeByUser (email: string) {
  console.log(email)
  try{
    const respoonse = await db.query(`SELECT id, name, email FROM "user" WHERE email = $1`, [`${email}`])
    return respoonse.rows
  }catch (error: any) {
    return error.message
  }
}

const executeByUserProperties = {
  name: 'executeByUser',
  description: `
    Busca os dados usuario pelo email.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      email: {
        type: Type.STRING,
        description: `
          Email do usuario busca dados como id
        `.trim()
      }
    },
    required: ['email']
  }
}

export { executeByUser, executeByUserProperties }