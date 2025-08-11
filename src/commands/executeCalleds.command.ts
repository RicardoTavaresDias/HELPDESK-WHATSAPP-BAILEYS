import Repository from "@/repositories/repository"

async function executeCalleds (emailUser: any) {
  const repository = new Repository()
  const result = await repository.calledsUser(emailUser)
  return JSON.stringify(result)
}

export { executeCalleds }