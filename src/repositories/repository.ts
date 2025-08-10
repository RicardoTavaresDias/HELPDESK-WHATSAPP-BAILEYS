import db from "@/config/postgres.config";

class Repository {
  async users (name: string) {
    const query = await db.query(`SELECT id, name, email, role FROM "user" WHERE name LIKE '%${name}%'`);
    return query.rows
  }
}

export default Repository