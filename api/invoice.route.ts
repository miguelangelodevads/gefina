import { Router } from 'express';
import { invoiceSchema, toFieldErrors } from './invoice.schema.ts';
import {
  findAllInvoices,
  findInvoiceById,
  insertInvoice,
  modifyInvoice,
  removeInvoice,
} from './invoice.service.ts';

const router = Router();

router.get('/', async (_request, response) => {
  const invoices = await findAllInvoices();
  response.status(200).json(invoices);
});

router.get('/:id', async (request, response) => {
  const rawId = request.params.id;
  const id = Number(rawId);

  if (
    !/^\d+$/.test(rawId) ||
    !Number.isSafeInteger(id) ||
    id < 1 ||
    id > 2147483647
  ) {
    response.status(400).json({
      error: { message: 'Identificador de fatura inválido.' },
    });
    return;
  }

  const invoice = await findInvoiceById(id);
  if (invoice === undefined) {
    response
      .status(404)
      .json({ error: { message: 'Fatura não encontrada.' } });
    return;
  }

  response.status(200).json(invoice);
});

router.post('/', async (request, response) => {
  const result = invoiceSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        status: 400,
        message: 'Dados inválidos.',
        fields: toFieldErrors(result.error),
      },
    });
    return;
  }

  const invoice = await insertInvoice(result.data);
  response.status(201).json(invoice);
});

router.put('/:id', async (request, response) => {
  const rawId = request.params.id;
  const id = Number(rawId);

  if (
    !/^\d+$/.test(rawId) ||
    !Number.isSafeInteger(id) ||
    id < 1 ||
    id > 2147483647
  ) {
    response.status(400).json({
      error: { message: 'Identificador de fatura inválido.' },
    });
    return;
  }

  const result = invoiceSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        status: 400,
        message: 'Dados inválidos.',
        fields: toFieldErrors(result.error),
      },
    });
    return;
  }

  const invoice = await modifyInvoice(id, result.data);
  if (!invoice) {
    response
      .status(404)
      .json({ error: { message: 'Fatura não encontrada.' } });
    return;
  }
  response.status(200).json(invoice);
});

router.delete('/:id', async (request, response) => {
  const rawId = request.params.id;
  const id = Number(rawId);

  if (
    !/^\d+$/.test(rawId) ||
    !Number.isSafeInteger(id) ||
    id < 1 ||
    id > 2147483647
  ) {
    response.status(400).json({
      error: { message: 'Identificador de fatura inválido.' },
    });
    return;
  }

  const deleted = await removeInvoice(id);
  if (!deleted) {
    response
      .status(404)
      .json({ error: { message: 'Fatura não encontrada.' } });
    return;
  }
  response.status(204).end();
});

export default router;
