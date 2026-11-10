import { existsSync } from 'node:fs';

const envFile = new URL('./.env.test', import.meta.url);
if (existsSync(envFile)) process.loadEnvFile(envFile);

// Nunca carregar o .env de desenvolvimento ou reutilizar DATABASE_URL de produção.
const connection =
  process.env.TEST_DATABASE_URL ??
  'postgresql://gefina:gefina_test@127.0.0.1:55432/gefina_test';
const target = new URL(connection);
if (
  !['postgres:', 'postgresql:'].includes(target.protocol) ||
  !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
  !target.pathname.endsWith('_test')
) {
  throw new Error(
    'Use TEST_DATABASE_URL de um PostgreSQL local com nome terminado em _test.',
  );
}
process.env.DATABASE_URL = connection;
