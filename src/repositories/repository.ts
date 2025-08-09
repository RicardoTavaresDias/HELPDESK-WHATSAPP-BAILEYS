import client from "@/config/postgres.config";

class Repository {
  constructor () {
    client.connect()
  }

  async users () {
    const result = await client.query('SELECT id, name, email, role FROM "user"');
    return result.rows
  }
}

export default Repository