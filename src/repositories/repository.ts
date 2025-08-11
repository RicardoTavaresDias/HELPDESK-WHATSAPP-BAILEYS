import db from "@/config/postgres.config";

class Repository {
  async users (querySQLAI: string) {
    try {
      const query = await db.query(querySQLAI);
      return query.rows
    } catch (error) {
      return error
    }
  }
}

export default Repository