import Repository from "@/repositories/repository";

import { GoogleGenAI, Type } from "@google/genai";
import { env } from "@/config/env.config";

/*
  async function main() {
    const response = await AI.models.generateContent({
      model,
      contents: "Quem é você? o que você poderá me ajudar?",
    });
    
    return response.text
  }
*/


/* ------------------------------------------------------------------------------------------------------ */

const AI = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

const prompt = `
  Verifica se existe nome Ricardo cadastrado no banco de dados?

  com a base do retorno dos dados da query, responder no retorno id, email e nome completo, e dizer que o mesmo esta cadastrado no sistema, passar em texto em portugues brasil numa forma natural, caso não ter resultado da query informar em texto que não existe o usuario mensionando no sistema.

`.trim()

async function testeAI () {
  const response = await AI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{
      role: "user",
      parts: [{
        text: prompt
      }]
    }],
    config: {
      tools: [{
        functionDeclarations: [{
          name: 'searchUsers',
          description: "Busca um usuário no banco de dados pelo nome.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "O nome do usuário a ser buscado."
              }
            },
            required: ['name']
          }
        }]
      }]
    }
  })

  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCalls = response.functionCalls[0]
    console.log('Função a ser chamada', functionCalls.name)
    console.log('Argumentos', JSON.stringify(functionCalls.args))

    if (functionCalls.name === 'searchUsers') {
      const name = functionCalls.args?.name;
      //@ts-ignore
      const functionResult = await searchUsers(name);
      console.log("Resultado da função: ", functionResult)

      // Parte 2: Envia o resultado da função de volta para o Gemini
      const finalResult  = await AI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }] },
          {
            role: 'function',
            parts: [{
              functionResponse: {
                name: 'searchUsers',
                response: { result: functionResult }
              }
            }]
          }
        ]
      })

      console.log("------------------------");
      console.log("Resposta final da IA:");
      console.log(finalResult.text);
      console.log("------------------------");

    } else {
      console.log('Chamada de função desconhecida:', functionCalls.name)
    }
    
  } else {
    console.log("Nenhuma chamada de função encontrada na resposta.")
    console.log(response.text)
  }
}



async function searchUsers (name: string) {
  const repository = new Repository()
  const result = await repository.users(name)
  return JSON.stringify(result)
}

export { testeAI }

/* ----------------------------------------------------------------------------------------------- */