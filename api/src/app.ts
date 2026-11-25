import { existsSync } from 'node:fs';
import path from 'node:path';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import prisma from './prisma.ts';
import customers from './routes/customer.route.ts';
import dashboard from './routes/dashboard.route.ts';
import invoices from './routes/invoice.route.ts';

function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(context, {
      name: error.name,
      message: error.message.replace(
        /postgres(?:ql)?:\/\/[^\s]+/g,
        '[conexão omitida]'
      ),
      code: 'code' in error ? error.code : undefined
    });
  } else {
    console.error(context, 'Erro sem detalhes disponíveis.');
  }
}

const app = express();
app.use(express.json());
const dist = path.join(
  import.meta.dirname,
  '..',
  '..',
  'web',
  'dist'
);

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});

app.get('/api/health', async (_request, response) => {
  try {
    const result = await prisma.$queryRaw<
      { database: string }[]
    >`SELECT current_database() AS database;`;
    response
      .status(200)
      .json({ status: 'ok', database: result[0].database });
  } catch (error) {
    logError('Falha na verificação do banco.', error);
    response
      .status(503)
      .json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/invoices', invoices);
app.use('/api/customers', customers);
app.use('/api/dashboard', dashboard);
app.use(express.static(dist));

// Entrega a aplicação para que o roteador do navegador abra a tela solicitada.
app.use((request, response, next) => {
  if (
    request.path.startsWith('/api') ||
    request.method !== 'GET' ||
    !existsSync(path.join(dist, 'index.html'))
  ) {
    next();
    return;
  }
  response.sendFile(path.join(dist, 'index.html'));
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});

const handleError: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  if (error && typeof error === 'object' && 'code' in error) {
    if (error.code === 'P2003') {
      response
        .status(400)
        .json({
          error: {
            status: 400,
            message: 'Cliente inválido.',
            fields: { customerId: 'Selecione um cliente existente.' }
          }
        });
      return;
    }
    if (error.code === 'P2025') {
      response
        .status(404)
        .json({ error: { message: 'Fatura não encontrada.' } });
      return;
    }
  }
  logError('Falha ao processar a requisição.', error);
  response.status(500).json({
    error: { message: 'Não foi possível processar a solicitação.' }
  });
};
app.use(handleError);

export default app;
