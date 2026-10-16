import path from 'node:path';
import type { ErrorRequestHandler } from 'express';
import express from 'express';

import pool from './database.ts';
import invoices from './invoice.route.ts';

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
  } catch {
    response
      .status(503)
      .json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/invoices', invoices);
app.use(express.static(dist));

app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});

const handleError: ErrorRequestHandler = (
  _error,
  _request,
  response,
  _next,
) => {
  console.error('Falha ao processar a requisição.');
  response
    .status(500)
    .json({
      error: { message: 'Não foi possível processar a solicitação.' },
    });
};
app.use(handleError);

app.listen(Number(process.env.PORT) || 3000);
