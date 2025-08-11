import Repository from "@/repositories/repository"
import { Type } from "@google/genai"

async function executeCalleds (emailUser: any) {
  const repository = new Repository()
  const result = await repository.calleds(emailUser)
  return JSON.stringify(result)
}

const executeCalledsProperties = {
  name: 'executeCalleds',
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

export { executeCalleds, executeCalledsProperties }