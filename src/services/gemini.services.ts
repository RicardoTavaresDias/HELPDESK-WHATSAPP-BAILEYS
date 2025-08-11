import { gemini } from "@/config/google.config"
import { systemInstruction } from "@/utils/geminai-systemInstruction";
import { command, commandProperties } from "@/commands";
import { switchFunctions } from "@/commands/switchFunctions";

/*
  functionCalls.name => nome da função criada para ser chamada
  functionCalls.args => parametro da função brigatório para ser passado na função
*/

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
        // declarando as propriedades e parametros da função para IA ultilizar
        functionDeclarations: [
        commandProperties.executeQueryProperties,
        commandProperties.executeCalledsProperties,
        commandProperties.executeCalledIDProperties
      ]
      }],
      systemInstruction: systemInstruction // Instruções para IA o que tem que fazer.
    }
  })

  // Verifica se IA usou a função se não passa somente o texto
  if (responseAI.functionCalls && responseAI.functionCalls.length > 0) {
    const functionCalls = responseAI.functionCalls[0]

    // Busca tipo de função que a IA vai ultilizar.
    const functionResult = await switchFunctions(functionCalls)

    // Envia o resultado da função de volta para o Gemini
    const geminaiResultQuestion  = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        temperature: 0.5
      },
      contents: [
        { role: 'user', parts: [{ text: question }] }, // pegando os parametros do primeira chamada
        {
          role: 'function',
          parts: [{
            functionResponse: {
              name: functionCalls.name,
              response: { result: functionResult }
            }
          }]
        }
      ]    
    })

    console.log("Resposta AI com funcção e resultado", geminaiResultQuestion.text)
    return geminaiResultQuestion.text
    
  } else {
    console.log("Resposta AI sem Função", responseAI.text)
    return responseAI.text
  }
}

export { geminaiAI }