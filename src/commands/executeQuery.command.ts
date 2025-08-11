import Repository from "@/repositories/repository"

async function executeQuery (querySQL: any) {
  const repository = new Repository()
  const result = await repository.users(querySQL)
  return JSON.stringify(result)
}

export { executeQuery }