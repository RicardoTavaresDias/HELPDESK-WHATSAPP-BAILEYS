import Repository from "@/repositories/repository"
import { tablePostgres } from "@/utils/table-postgres"
import { Type } from "@google/genai"

async function executeQuery (querySQL: string) {
  const repository = new Repository()
  const result = await repository.variousqueriesAI(querySQL)
  return JSON.stringify(result)
}

const executeQueryProperties = {
  name: 'executeQuery',
  description: `
    Realiza uma query no Postgress para buscar informações sobre as tabelas do banco de dados.

    Só pode realizar operações de busca (SELECT), não é permitido a geração de qualquer operação de escrita.

    Tables:
    """""""
    ${tablePostgres}
    """""""
    todas operações devem retornar um máximo de 50 itens.
  `.trim(),
  parameters: {
    type: Type.OBJECT,
    properties: {
      querySQL: {
        type: Type.STRING,
        description: "A query SQL a ser executada."
      }
    },
    required: ['querySQL']
  }
}

export { executeQuery, executeQueryProperties }