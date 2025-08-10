import Repository from "@/repositories/repository";
import { gemini } from "@/config/google.config"
import { Type } from "@google/genai";
import { tablePostgres } from "@/utils/table-postgres"; 
import { systemInstruction } from "@/utils/geminai-systemInstruction";

async function geminaiAI (question: any) {
  const responseAI = await gemini.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [{
      role: "user",
      parts: [{
        text: question
      }]
    }],
    config: {
      temperature: 0.5,
      tools: [{
        functionDeclarations: [{
          name: 'executeSqlQuery',
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
        }]
      }],
      systemInstruction: systemInstruction
    }
  })

  if (responseAI.functionCalls && responseAI.functionCalls.length > 0) {
    const functionCalls = responseAI.functionCalls[0]   

    if (functionCalls.name === 'executeSqlQuery') { // Função a ser chamada functionCalls.name
      const query = functionCalls.args?.querySQL; // Argumentos functionCalls.args
      const functionResult = await executeSqlQuery(query);
  
      // Envia o resultado da função de volta para o Gemini
      const geminaiResultQuestion  = await gemini.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          { role: 'user', parts: [{ text: question }] },
          {
            role: 'function',
            parts: [{
              functionResponse: {
                name: 'executeSqlQuery',
                response: { result: functionResult }
              }
            }]
          }
        ]
      })

      return geminaiResultQuestion.text
    } else {
      return functionCalls.name
    }
    
  } else {
    return responseAI.text
  }
}

async function executeSqlQuery (querySQL: any) {
  const repository = new Repository()
  const result = await repository.users(querySQL)
  return JSON.stringify(result)
}

export { geminaiAI }