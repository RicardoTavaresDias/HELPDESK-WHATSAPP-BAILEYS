import Repository from "@/repositories/repository"
import { Type } from "@google/genai"

async function executeCalledId (id: string) {
  try {
    const repository = new Repository()
    const result = await repository.calledID(id)
    return JSON.stringify(result)
  } catch (error) {
    console.log(error)
    return JSON.stringify(error)
  }
}

const executeCalledIDProperties = {
  name: 'executeCalledId',
  description: `
    lista o chamado especifico com numero do chamado ou id do chamado.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "id do chamado ou numero de chamado"
      }
    },
    required: ['id']
  }
}

export { executeCalledId, executeCalledIDProperties }