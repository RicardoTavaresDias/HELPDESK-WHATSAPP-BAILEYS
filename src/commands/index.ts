import { listCalleds, listCalledsProperties } from "./listCalleds.command"
import { getCalledById, getCalledByIdProperties } from "./getCalledById.command"
import { createCalled, createCalledProperties } from "./createCalled.command";
import { getServices, getServicesProperties } from "./getServices.command";
import { getUserByEmail, getUserByEmailProperties } from "./getUserByEmail.command"

const command = {
  listCalleds,
  getCalledById,
  createCalled,
  getServices,
  getUserByEmail
}

const commandProperties = {
  listCalledsProperties,
  getCalledByIdProperties,
  createCalledProperties,
  getServicesProperties,
  getUserByEmailProperties
}

export { command, commandProperties }