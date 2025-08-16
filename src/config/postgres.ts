import { Pool } from 'pg';
import { env } from './env';

const db = new Pool({
  user: env.USER_DB,                     // usuário do PostgreSQL
  host: env.HOST_DB,                    // host ou IP do servidor
  database: env.DATABASE,               // nome do banco
  password: env.PASSWORD,              // senha do usuário
  port: env.PORT_DB,                   // porta padrão do PostgreSQL
  ssl: { rejectUnauthorized: false }  // Render exige SSL
})

export default db