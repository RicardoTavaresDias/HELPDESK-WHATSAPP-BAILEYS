import db from "@/config/postgres"
import { Type } from "@google/genai"

async function executeByUser (email: string) {
  console.log(email)
  try{
    const respoonse = await db.query(`SELECT id, name, email FROM "user" WHERE email = '${email}'`)
    console.log(respoonse.rows)
    return JSON.stringify(respoonse.rows)
  }catch (error: any) {
    return JSON.stringify(error.message)
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