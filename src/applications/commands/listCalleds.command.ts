import Repository from "@/repositories/repository"
import { Type } from "@google/genai"

async function listCalleds (emailUser: string) {
  try {
    const repository = new Repository()
    const result = await repository.calleds(emailUser)
    return JSON.stringify(result)
  } catch (error) {
    console.error(error)
    return JSON.stringify(error)
  }
}

const listCalledsProperties = {
  name: 'listCalleds',
  description: `
    Lista todas as informações do chamado com email.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      emailUser: {
        type: Type.STRING,
        description: `
          email do usuario.
        `.trim()
      }
    },
    required: ['emailUser']
  }
}

export { listCalleds, listCalledsProperties }