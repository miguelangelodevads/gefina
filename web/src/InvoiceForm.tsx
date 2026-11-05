import {
  type SetStateAction,
  type SubmitEvent,
  useState,
} from 'react';
import type { CustomerOption } from './customerType.ts';
import type {
  Invoice,
  InvoiceFieldErrors,
  InvoiceInput,
  InvoiceStatus,
} from './invoiceType.ts';

interface InvoiceFormProps {
  invoice: Invoice | null;
  customers: CustomerOption[];
  error: string | null;
  fieldErrors: InvoiceFieldErrors;
  confirmDelete: boolean;
  setConfirmDelete: React.Dispatch<SetStateAction<boolean>>;
  confirm: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSubmit: (values: InvoiceInput) => void;
  busy: boolean;
}

export default function InvoiceForm(props: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState(
    !props.invoice ? '' : props.invoice.customer.id,
  );
  const [amount, setAmount] = useState(
    !props.invoice ? '' : (props.invoice.amount / 100).toFixed(2),
  );
  const [status, setStatus] = useState<InvoiceStatus>(
    !props.invoice ? 'pending' : props.invoice.status,
  );
  const [issueDate, setIssueDate] = useState(
    !props.invoice ? '' : props.invoice.issueDate,
  );
  const [dueDate, setDueDate] = useState(
    !props.invoice ? '' : props.invoice.dueDate,
  );

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    props.setConfirmDelete(false);

    props.onSubmit({
      customerId: Number(customerId),
      amount: Math.round(Number(amount) * 100),
      status,
      issueDate,
      dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{!props.invoice ? 'Criar fatura' : 'Editar fatura'}</h2>

      <div className="field">
        <label htmlFor="customer">Cliente</label>
        <select
          id="customer"
          aria-invalid={Boolean(props.fieldErrors.customerId)}
          aria-describedby={
            props.fieldErrors.customerId
              ? 'customer-error'
              : undefined
          }
          disabled={props.busy}
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
        >
          <option value="">Selecione um cliente</option>
          {props.customers.map((customer) => {
            return (
              <option key={customer.id} value={customer.id}>
                {customer.name} — {customer.email}
              </option>
            );
          })}
        </select>
        {props.fieldErrors.customerId && (
          <p id="customer-error" className="form-error">
            {props.fieldErrors.customerId}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="amount">Valor</label>
        <input
          id="amount"
          aria-invalid={Boolean(props.fieldErrors.amount)}
          aria-describedby={
            props.fieldErrors.amount ? 'amount-error' : undefined
          }
          type="number"
          step="0.01"
          min="0.01"
          disabled={props.busy}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        {props.fieldErrors.amount && (
          <p id="amount-error" className="form-error">
            {props.fieldErrors.amount}
          </p>
        )}
      </div>
      <div className="horizontal-fields">
        <div className="field">
          <label htmlFor="status">Situação</label>
          <select
            id="status"
            aria-invalid={Boolean(props.fieldErrors.status)}
            aria-describedby={
              props.fieldErrors.status ? 'status-error' : undefined
            }
            disabled={props.busy}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as InvoiceStatus)
            }
          >
            <option value="pending">Pendente</option>
            <option value="paid">Paga</option>
          </select>
          {props.fieldErrors.status && (
            <p id="status-error" className="form-error">
              {props.fieldErrors.status}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="issueDate">Emissão</label>
          <input
            id="issueDate"
            aria-invalid={Boolean(props.fieldErrors.issueDate)}
            aria-describedby={
              props.fieldErrors.issueDate
                ? 'issueDate-error'
                : undefined
            }
            type="date"
            disabled={props.busy}
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
            required
          />
          {props.fieldErrors.issueDate && (
            <p id="issueDate-error" className="form-error">
              {props.fieldErrors.issueDate}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="dueDate">Vencimento</label>
          <input
            id="dueDate"
            aria-invalid={Boolean(props.fieldErrors.dueDate)}
            aria-describedby={
              props.fieldErrors.dueDate ? 'dueDate-error' : undefined
            }
            type="date"
            min={issueDate}
            disabled={props.busy}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
          {props.fieldErrors.dueDate && (
            <p id="dueDate-error" className="form-error">
              {props.fieldErrors.dueDate}
            </p>
          )}
        </div>
      </div>

      {!props.error ? null : (
        <p className="form-error">{props.error}</p>
      )}

      <div className="form-actions">
        {!props.invoice ? null : (
          <button
            className="button-danger"
            type="button"
            onClick={props.onDelete}
            disabled={props.busy}
          >
            {props.busy && props.confirmDelete
              ? 'Excluindo...'
              : 'Excluir'}
          </button>
        )}
        <button
          className="button-secondary"
          type="button"
          onClick={props.onCancel}
          disabled={props.busy}
        >
          Cancelar
        </button>
        <button
          className="button-primary"
          type="submit"
          disabled={props.busy}
        >
          {props.busy && !props.confirmDelete
            ? 'Salvando...'
            : 'Salvar'}
        </button>
      </div>

      {props.confirmDelete && (
        <div className="confirm-form">
          <p>
            A exclusão é definitiva e não pode ser desfeita. Deseja
            prosseguir?
          </p>
          <button
            className="button-secondary"
            type="button"
            onClick={() => props.setConfirmDelete(false)}
            disabled={props.busy}
          >
            Não
          </button>
          <button
            className="button-danger"
            type="button"
            onClick={props.confirm}
            disabled={props.busy}
          >
            Sim
          </button>
        </div>
      )}
    </form>
  );
}
