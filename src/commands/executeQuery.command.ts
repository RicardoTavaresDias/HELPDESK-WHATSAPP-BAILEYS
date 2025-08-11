import Repository from "@/repositories/repository"

async function executeQuery (querySQL: any) {
  const repository = new Repository()
  const result = await repository.variousqueriesAI(querySQL)
  return JSON.stringify(result)
}

export { executeQuery }