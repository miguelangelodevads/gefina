import supertest from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import app from './app.ts';

import pool from './database.ts';

const customer = {
  id: 0,
  email: 'teste@gefina.com.br',
};

const invoice = { id: 0 };
const user = { id: 0, email: 'rotas@gefina.test' };

async function clear(): Promise<void> {
  await pool.query(
    `
            DELETE FROM invoices
            WHERE customer_id IN (
                SELECT id FROM customers
                WHERE email = $1
            );
        `,
    [customer.email],
  );

  await pool.query(
    `
            DELETE FROM customers
            WHERE email = $1;
        `,
    [customer.email],
  );
}

async function populate(): Promise<void> {
  const connectCustomer = await pool.query(
    `
            INSERT INTO customers (user_id, name, email)
            VALUES ($2, 'Teste', $1)
            RETURNING id;
        `,
    [customer.email, user.id],
  );

  customer.id = connectCustomer.rows[0].id;

  const connectInvoice = await pool.query(
    `
            INSERT INTO invoices (customer_id, amount, status, issue_date, due_date)
            VALUES ($1, 125037, 'pending', '2020-01-01', '2020-01-31')
            RETURNING id;
        `,
    [customer.id],
  );

  invoice.id = connectInvoice.rows[0].id;
}

const request = supertest(app);

describe('rotas de faturas', () => {
  it('verifica a saúde da aplicação no banco de testes', async () => {
    const response = await request.get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      database: 'gefina_test',
    });
  });

  it('devolve 404 ao buscar uma fatura inexistente', async () => {
    const response = await request.get('/api/invoices/2147483647');
    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe(
      'Fatura não encontrada.',
    );
  });

  it('recusa edição com datas inválidas sem alterar a fatura', async () => {
    const response = await request
      .put(`/api/invoices/${invoice.id}`)
      .send({
        customerId: customer.id,
        amount: 100,
        status: 'paid',
        issueDate: '2020-02-01',
        dueDate: '2020-01-31',
      });
    expect(response.status).toBe(400);
    expect(response.body.error.fields.dueDate).toBeDefined();
    const saved = await request.get(`/api/invoices/${invoice.id}`);
    expect(saved.body.amount).toBe(125037);
    expect(saved.body.status).toBe('pending');
  });

  beforeAll(async () => {
    const result = await pool.query<{ id: number }>(
      `INSERT INTO users (name, email, password_hash)
                 VALUES ('Teste de rotas', $1, 'apenas-teste')
                 ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
                 RETURNING id;`,
      [user.email],
    );
    user.id = result.rows[0].id;
  });

  beforeEach(async () => {
    await clear();
    await populate();
  });

  afterAll(async () => {
    await clear();
    await pool.query('DELETE FROM users WHERE id = $1;', [user.id]);
    await pool.end();
  });

  it('devolve a relação de faturas', async () => {
    const response = await request.get('/api/invoices');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('cria fatura e devolve o registro criado', async () => {
    const response = await request.post('/api/invoices').send({
      customerId: customer.id,
      amount: 12345,
      status: 'pending',
      issueDate: '2020-01-01',
      dueDate: '2020-01-31',
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.amount).toBe(12345);
    expect(response.body.customer.id).toBe(customer.id);
    expect(response.body.situation).toBe('overdue');
  });

  it('altera fatura e devolve fatura alterada', async () => {
    const response = await request
      .put(`/api/invoices/${invoice.id}`)
      .send({
        customerId: customer.id,
        amount: 125037,
        status: 'paid',
        issueDate: '2020-01-01',
        dueDate: '2020-01-31',
      });

    expect(response.status).toBe(200);
    expect(response.body.situation).toBe('paid');
    expect(response.body.status).toBe('paid');
  });

  it('remove fatura', async () => {
    const removal = await request.delete(
      `/api/invoices/${invoice.id}`,
    );
    const search = await request.get(`/api/invoices/${invoice.id}`);

    expect(removal.status).toBe(204);
    expect(search.status).toBe(404);
  });

  it('recusa busca de fatura com identificador inválido', async () => {
    const response = await request.get('/api/invoices/abc');

    expect(response.status).toBe(400);
  });

  it('recusa criação de fatura com valor zerado', async () => {
    const response = await request.post('/api/invoices').send({
      customerId: customer.id,
      amount: 0,
      status: 'pending',
      issueDate: '2020-01-01',
      dueDate: '2020-01-31',
    });

    expect(response.status).toBe(400);
    expect(response.body.error.fields.amount).toBeDefined();
  });
});
