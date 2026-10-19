import { Router } from 'express';

import {
  findAllInvoices,
  findInvoiceById,
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

export default router;
