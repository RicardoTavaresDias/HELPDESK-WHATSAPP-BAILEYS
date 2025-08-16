import { executeQuery, executeQueryProperties } from "./executeQuery.command";
import { executeCalleds, executeCalledsProperties } from "./executeCalleds.command"
import { executeCalledId, executeCalledIDProperties } from "./executeCalledId.command"
import { executeCreateCalled, executeCreateCalledProperties } from "./executeCreateCalled.command";
import { executeServices, executeServicesProperties } from "./executeServices.command";
import { executeByUser, executeByUserProperties } from "./executeByUser.command"

const command = {
  executeQuery,
  executeCalleds,
  executeCalledId,
  executeCreateCalled,
  executeServices,
  executeByUser
}

const commandProperties = {
  executeQueryProperties,
  executeCalledsProperties,
  executeCalledIDProperties,
  executeCreateCalledProperties,
  executeServicesProperties,
  executeByUserProperties
}

export { command, commandProperties }