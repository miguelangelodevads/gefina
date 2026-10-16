import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('A variável DATABASE_URL não está disponível.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  query_timeout: 5000,
});

// Uma conexão ociosa pode cair quando o banco suspende ou reinicia.
pool.on('error', () => {
  console.error('Uma conexão ociosa com o banco foi interrompida.');
});

export default pool;
