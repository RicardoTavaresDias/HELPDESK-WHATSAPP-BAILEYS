import { command } from "./commands";
import { AllFunctionCalls } from "@/types/functionCall-args.reponse";

async function switchFunctions (functionCalls: AllFunctionCalls) {
  let functionResult

  switch (functionCalls.name) {
    case 'listCalleds':
      return functionResult = await command.listCalleds(functionCalls.args?.emailUser);
  
    case 'getCalledById':
      return functionResult = await command.getCalledById(functionCalls.args?.id);
    
    case 'createCalled':
      return functionResult = await command.createCalled(functionCalls.args?.data);

    case 'getServices':
      return functionResult = await command.getServices();

    case 'getUserByEmail':
      return functionResult = await command.getUserByEmail(functionCalls.args?.email);
  
    default:
      break
  }
}

export { switchFunctions }