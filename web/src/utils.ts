import type { InvoiceSituation } from './invoiceType.ts';

export function situationLabel(situation: InvoiceSituation): string {
  switch (situation) {
    case 'paid':
      return 'Paga';
    case 'pending':
      return 'Pendente';
    case 'overdue':
      return 'Atrasada';
  }
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}
