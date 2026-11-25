import { useEffect, useState } from 'react';

import type { Dashboard } from '../types/dashboardType.ts';
import { formatCurrency } from '../utils.ts';
import InvoiceSummaryTable from './InvoiceSummaryTable.tsx';
import SummaryCard from './SummaryCard.tsx';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<null | Dashboard>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboard() {
      try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
          setError('Não foi possível carregar o painel inicial.');
          setLoading(false);
          return;
        }

        const datas = await response.json();
        setDashboard(datas);
      } catch (error) {
        console.error(error);

        setError('Não foi possível carregar o painel inicial.');
      }

      setLoading(false);
    }

    getDashboard();
  }, []);

  if (loading)
    return <p className="text-sm text-text-muted">Carregando...</p>;

  if (error !== null || dashboard === null)
    return <p className="text-overdue">{error}</p>;

  return (
    <>
      <h1 className="text-xl font-semibold mb-7">Painel Inicial</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total recebido: "
          value={formatCurrency(dashboard.totals.paid)}
        />
        <SummaryCard
          label="Total pendente: "
          value={formatCurrency(dashboard.totals.pending)}
        />
        <SummaryCard
          label="Faturas: "
          value={String(dashboard.totals.invoiceCount)}
        />
        <SummaryCard
          label="Clientes: "
          value={String(dashboard.totals.customerCount)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <InvoiceSummaryTable
          title="Faturas Recentes"
          dateLabel="Emissão"
          invoices={dashboard.recentInvoices}
          date={(invoice) => invoice.issueDate}
        />
        <InvoiceSummaryTable
          title="Faturas Atrasadas"
          dateLabel="Vencimento"
          invoices={dashboard.overdueInvoices}
          date={(invoice) => invoice.dueDate}
        />
      </div>

      <small className="block mt-6 text-center text-text-muted">
        &copy; 2026. Gefina - Gestão financeira simples e eficiente.
      </small>
    </>
  );
}
