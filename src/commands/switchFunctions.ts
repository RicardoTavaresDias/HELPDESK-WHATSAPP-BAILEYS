import { command } from "@/commands";
import { AllFunctionCalls } from "@/types/functionCall-args.reponse";

async function switchFunctions (functionCalls: AllFunctionCalls) {
  let functionResult

  switch (functionCalls.name) {
    case 'executeQuery':
      return functionResult = await command.executeQuery(functionCalls.args?.querySQL);

    case 'executeCalleds':
      return functionResult = await command.executeCalleds(functionCalls.args?.emailUser);
  
    case 'executeCalledId':
      return functionResult = await command.executeCalledId(functionCalls.args?.id);
  
    default:
      // console.log("nome da função vai ser chamada", functionCalls.name)
      return // functionCalls.name
  }
}

export { switchFunctions }