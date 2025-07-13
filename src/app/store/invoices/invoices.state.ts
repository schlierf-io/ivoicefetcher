import { Invoice } from '../../models/invoice.model';

export interface InvoicesState {
  invoices: Invoice[];
  selectedInvoices: string[];
  isLoading: boolean;
  error: string | null;
}

export const initialInvoicesState: InvoicesState = {
  invoices: [],
  selectedInvoices: [],
  isLoading: false,
  error: null
};