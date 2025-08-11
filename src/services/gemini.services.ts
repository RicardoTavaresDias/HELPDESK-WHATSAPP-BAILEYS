import { gemini } from "@/config/google.config"
import { Type } from "@google/genai";
import { tablePostgres } from "@/utils/table-postgres"; 
import { systemInstruction } from "@/utils/geminai-systemInstruction";
import { command } from "@/commands";

async function geminaiAI (question: any) {
  const responseAI = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
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
        }]
      }],
      systemInstruction: systemInstruction
    }
  })

  if (responseAI.functionCalls && responseAI.functionCalls.length > 0) {
    const functionCalls = responseAI.functionCalls[0]   

    if (functionCalls.name === 'executeQuery') { // Função a ser chamada functionCalls.name
      console.log("função com argumento", functionCalls.args)
      const query = functionCalls.args?.querySQL; // Argumentos functionCalls.args
      const functionResult = await command.executeQuery(query);
  
      // Envia o resultado da função de volta para o Gemini
      const geminaiResultQuestion  = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.5
        },
        contents: [
          { role: 'user', parts: [{ text: question }] },
          {
            role: 'function',
            parts: [{
              functionResponse: {
                name: 'executeQuery',
                response: { result: functionResult }
              }
            }]
          }
        ]
      })

      console.log("Resposta AI com funcção e resultado", geminaiResultQuestion.text)
      return geminaiResultQuestion.text
    } else {
      console.log("nome da função vai ser chamada", functionCalls.name)
      return functionCalls.name
    }
    
  } else {
    console.log("Resposta AI sem Função", responseAI.text)
    return responseAI.text
  }
}

export { geminaiAI }