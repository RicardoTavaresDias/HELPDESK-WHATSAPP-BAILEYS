import { executeQuery, executeQueryProperties } from "./executeQuery.command";
import { executeCalleds, executeCalledsProperties } from "./executeCalleds.command"
import { executeCalledId, executeCalledIDProperties } from "./executeCalledId.command"

const command = {
  executeQuery,
  executeCalleds,
  executeCalledId
}

const commandProperties = {
  executeQueryProperties,
  executeCalledsProperties,
  executeCalledIDProperties
}

export { command, commandProperties }