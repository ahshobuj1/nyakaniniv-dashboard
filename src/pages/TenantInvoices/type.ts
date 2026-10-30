export interface InvoiceTransaction {
  id: string;
  gateway: string | null;
  channel?: string | null;
  gatewayReference: string | null;
  createdAt?: string;
}

export interface InvoiceClient {
  name: string | null;
  email: string | null;
  phone?: string | null;
}

export interface InvoiceBooking {
  id: string;
  eventType: string | null;
  client?: InvoiceClient | null;
}

export interface InvoiceUser {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface InvoicePlan {
  name: string | null;
}

export interface InvoiceTenant {
  id?: string;
  subdomain: string | null;
  stageName: string | null;
}

export interface Invoice {
  id: string;
  amount: number | string;
  currencyCode: string | null;
  status: string;
  type: 'SUBSCRIPTION' | 'BOOKING' | string;
  dueDate?: string | null;
  createdAt: string;
  gateway?: string | null;
  channel?: string | null;
  method?: string | null;
  transactionId?: string | null;
  gatewayReference?: string | null;
  transactions?: InvoiceTransaction[];
  booking?: InvoiceBooking | null;
  user?: InvoiceUser | null;
  plan?: InvoicePlan | null;
  tenant?: InvoiceTenant | null;
}

export interface InvoicesResponse {
  success: boolean;
  message: string;
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
  data: Invoice[];
}

