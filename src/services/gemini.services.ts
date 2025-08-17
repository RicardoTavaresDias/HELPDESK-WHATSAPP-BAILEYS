import { gemini } from "@/config/google"
import { prompt } from "@/utils/geminai-systemInstruction";
import { commandProperties } from "@/commands";
import { switchFunctions } from "@/commands/switchFunctions";
import { AllFunctionCalls } from "@/types/functionCall-args.reponse";

/*
  functionCalls.name => nome da função criada para ser chamada
  functionCalls.args => parametro da função brigatório para ser passado na função
*/

const history = new Map()

async function geminaiAI (userWhatsapp: string, question: string) {
  console.log(history.get(userWhatsapp))
  console.log('userWhatsapp', userWhatsapp)

  
  setTimeout(() => history.delete(userWhatsapp), 5 * 60 * 60 * 1000)

  if(!history.has(userWhatsapp)){
    console.log("caiu aqui")
    history.set(userWhatsapp, [{
      role: "user",
      parts: [{
        text: question
      }]
    }])
  } else {
    history.get(userWhatsapp).push({
      role: "user",
      parts: [{
        text: question
      }]
    })
  }

  try {
    const responseAI = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history.get(userWhatsapp),
      config: {
        temperature: 0.4,
        tools: [{
          // declarando as propriedades e parametros da função para IA ultilizar
          functionDeclarations: [
          commandProperties.listCalledsProperties,
          commandProperties.getCalledByIdProperties,
          commandProperties.createCalledProperties,
          commandProperties.getServicesProperties,
          commandProperties.getUserByEmailProperties
        ]
        }],
        systemInstruction: prompt // Instruções para IA o que tem que fazer.
      }
    })

    // Verifica se IA usou a função se não passa somente o texto
    if (responseAI.functionCalls && responseAI.functionCalls.length > 0) {
      const functionCalls = responseAI.functionCalls[0]

      // Busca tipo de função que a IA vai ultilizar.
      const functionResult = await switchFunctions(functionCalls as AllFunctionCalls)

      history.get(userWhatsapp).push({
        role: 'function',
        parts: [{
          functionResponse: {
            name: functionCalls.name,
            response: { result: functionResult }
          }
        }]
      })

      // Envia o resultado da função de volta para o Gemini
      const geminaiResultQuestion  = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.4
        },
        contents: history.get(userWhatsapp)   
      })

      console.log("Resposta AI com funcção e resultado", geminaiResultQuestion.text)
      return geminaiResultQuestion.text
      
    } else {
      console.log("Resposta AI sem Função", responseAI.text)
      return responseAI.text
    }
  } catch (error: any) {
    if (error.status === 429) {
      console.error("⚠️ Limite diário do Gemini atingido:")
      return "⚠️ O sistema atingiu o limite de uso da IA hoje. Tente novamente em alguns minutos."
    }

    console.error("Erro inesperado na IA:", error)
    return "❌ Ocorreu um erro interno ao processar sua solicitação."
  }
}

export { geminaiAI }