import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, mock, test } from 'node:test';
import express from 'express';
import {
  createInvoice,
  updateInvoice,
} from '../web/src/invoiceApi.ts';
import { invoiceSchema, toFieldErrors } from './invoice.schema.ts';

// Testes usam endereço fictício e consultas simuladas; nunca acessam o Neon.
process.env.DATABASE_URL =
  'postgresql://test:test@127.0.0.1:1/gefina_test';
const { default: pool } = await import('./database.ts');
const { default: router } = await import('./invoice.route.ts');

const valid = {
  customerId: 1,
  amount: 125000,
  status: 'pending' as const,
  issueDate: '2026-11-05',
  dueDate: '2026-11-20',
};

for (const status of ['pending', 'paid']) {
  test(`aceita fatura válida com situação ${status}`, () => {
    assert.equal(
      invoiceSchema.safeParse({ ...valid, status }).success,
      true,
    );
  });
}

for (const [field, value] of [
  ['customerId', 0],
  ['customerId', 1.5],
  ['customerId', null],
  ['amount', 0],
  ['amount', -1],
  ['amount', 1.5],
  ['amount', '125000'],
  ['status', 'overdue'],
  ['issueDate', '2026-02-30'],
  ['dueDate', '2026-11-01'],
] as const) {
  test(`rejeita ${field} inválido: ${JSON.stringify(value)}`, () => {
    const result = invoiceSchema.safeParse({
      ...valid,
      [field]: value,
    });
    assert.equal(result.success, false);
    if (!result.success)
      assert.ok(toFieldErrors(result.error)[field]);
  });
}

test('aceita emissão e vencimento no mesmo dia', () => {
  assert.equal(
    invoiceSchema.safeParse({ ...valid, dueDate: valid.issueDate })
      .success,
    true,
  );
});

const app = express();
app.use(express.json());
app.use('/api/invoices', router);
const query = mock.method(pool, 'query', async () => {
  throw new Error('A validação deve impedir o acesso ao banco.');
});
const server = app.listen(0, '127.0.0.1');
let base: string;
before(async () => {
  if (!server.listening)
    await new Promise<void>((resolve) =>
      server.once('listening', resolve),
    );
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(async () => {
  query.mock.restore();
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  await pool.end();
});

for (const [method, path] of [
  ['POST', '/api/invoices'],
  ['PUT', '/api/invoices/1'],
]) {
  test(`${method} devolve erros dos campos antes de consultar o banco`, async () => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...valid,
        amount: 0,
        dueDate: '2026-11-01',
      }),
    });
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error.status, 400);
    assert.ok(body.error.fields.amount);
    assert.ok(body.error.fields.dueDate);
    assert.equal(query.mock.callCount(), 0);
  });
}

for (const [name, action] of [
  ['criação', () => createInvoice(valid)],
  ['edição', () => updateInvoice(1, valid)],
] as const) {
  test(`cliente HTTP preserva os erros de validação na ${name}`, async () => {
    const fetchMock = mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            error: {
              message: 'Dados inválidos.',
              fields: { amount: 'Informe um valor positivo.' },
            },
          }),
          {
            status: 400,
            headers: { 'content-type': 'application/json' },
          },
        ),
    );
    try {
      assert.deepEqual(await action(), {
        message: 'Dados inválidos.',
        fields: { amount: 'Informe um valor positivo.' },
      });
    } finally {
      fetchMock.mock.restore();
    }
  });
}
