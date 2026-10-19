import path from 'node:path';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import dashboard from './dashboard.route.ts';
import pool from './database.ts';
import invoices from './invoice.route.ts';

function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(context, {
      name: error.name,
      message: error.message.replace(
        /postgres(?:ql)?:\/\/[^\s]+/g,
        '[conexão omitida]',
      ),
      code: 'code' in error ? error.code : undefined,
    });
  } else {
    console.error(context, 'Erro sem detalhes disponíveis.');
  }
}

const app = express();
const dist = path.join(import.meta.dirname, '..', 'web', 'dist');

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});

app.get('/api/health', async (_request, response) => {
  try {
    const result = await pool.query<{ database: string }>(
      'SELECT current_database() AS database;',
    );
    response
      .status(200)
      .json({ status: 'ok', database: result.rows[0].database });
  } catch (error) {
    logError('Falha na verificação do banco.', error);
    response
      .status(503)
      .json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/invoices', invoices);
app.use('/api/dashboard', dashboard);
app.use(express.static(dist));

app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});

const handleError: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  logError('Falha ao processar a requisição.', error);
  response.status(500).json({
    error: { message: 'Não foi possível processar a solicitação.' },
  });
};
app.use(handleError);

app.listen(Number(process.env.PORT) || 3000);
