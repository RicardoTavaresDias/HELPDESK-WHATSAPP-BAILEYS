import db from "@/config/postgres"
import { Type } from "@google/genai"

async function getUserByEmail (email: string) {
  try{
    const respoonse = await db.query(`SELECT id, name, email FROM "user" WHERE email = '${email}'`)
    return JSON.stringify(respoonse.rows)
  }catch (error: any) {
    console.error(error)
    return JSON.stringify(error.message)
  }
}

const getUserByEmailProperties = {
  name: 'getUserByEmail',
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

export { getUserByEmail, getUserByEmailProperties }