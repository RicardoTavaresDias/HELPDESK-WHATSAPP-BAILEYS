import db from "@/config/postgres.config";

class Repository {
  async users (querySQLAI: string) {
    const query = await db.query(querySQLAI);
    return query.rows
  }
}

export default Repository