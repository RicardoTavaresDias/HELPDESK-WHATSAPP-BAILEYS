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
    
    case 'executeCreateCalled':
      return functionResult = await command.executeCreateCalled(functionCalls.args?.data);

    case 'executeServices':
      return functionResult = await command.executeServices(functionCalls.args?.searchServices);

    case 'executeByUser':
      return functionResult = await command.executeByUser(functionCalls.args?.email);
  
    default:
      break
  }
}

export { switchFunctions }