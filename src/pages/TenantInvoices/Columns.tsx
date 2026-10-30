import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {formatDate} from '@/utils/formatDate';
import {Download} from 'lucide-react';
import {PlanBadge} from '@/components/common/PlanBadge';
import type {Invoice} from './type';

function getInvoiceStatusBadge(status: string) {
  const s = (status || 'UNPAID').toUpperCase();
  switch (s) {
    case 'PAID':
    case 'COMPLETED':
      return (
        <Badge className="bg-emerald-600 text-white capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'UNPAID':
    case 'PENDING':
      return (
        <Badge variant="secondary" className="capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'OVERDUE':
    case 'FAILED':
    case 'CANCELLED':
      return (
        <Badge variant="destructive" className="capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize">
          {s.toLowerCase()}
        </Badge>
      );
  }
}

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'serialNumber',
    header: 'SN',
    cell: ({row, table}) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-muted-foreground font-mono text-xs w-7">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'Invoice #',
    cell: ({row}) => {
      const invNumber = `INV-${row.original.id.slice(0, 8).toUpperCase()}`;
      return (
        <span className="font-mono text-xs font-semibold text-foreground">
          {invNumber}
        </span>
      );
    },
  },
  {
    id: 'customer',
    header: 'Tenant',
    cell: ({row}) => {
      const isBooking = row.original.type === 'BOOKING';
      const name = isBooking
        ? row.original.booking?.client?.name || 'Guest Client'
        : `${row.original.user?.firstName || ''} ${row.original.user?.lastName || ''}`.trim() ||
          'Tenant User';
      const email = isBooking
        ? row.original.booking?.client?.email || 'No email'
        : row.original.user?.email || 'No email';

      return (
        <div className="flex flex-col py-1 gap-0.5 max-w-[220px]">
          <span className="font-semibold text-sm text-foreground truncate">
            {name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {email}
          </span>
        </div>
      );
    },
  },
  {
    id: 'plan',
    header: 'Plan',
    cell: ({row}) => {
      const planName =
        row.original.plan?.name ||
        (row.original.type === 'BOOKING' ? 'Booking' : 'Standard');

      return <PlanBadge name={planName} />;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({row}) => {
      const amount = Number(row.original.amount || 0);
      const curr = row.original.currencyCode || 'KES';
      return (
        <span className="font-semibold text-sm font-mono">
          {curr} {amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => getInvoiceStatusBadge(row.original.status),
  },
  {
    id: 'method',
    header: 'Method / Gateway',
    cell: ({row}) => {
      const gateway = row.original.gateway;
      const channel = row.original.channel || row.original.method;

      if (!gateway && !channel) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }

      const methodStr =
        gateway && channel && gateway.toUpperCase() !== channel.toUpperCase()
          ? `${channel} (${gateway})`.replace(/_/g, ' ')
          : (gateway || channel || '—').replace(/_/g, ' ');

      return (
        <Badge variant="outline" className="capitalize font-normal text-xs">
          {methodStr}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created On',
    cell: ({row}) => {
      const d = row.original.createdAt;
      if (!d) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="text-xs text-muted-foreground">{formatDate(d)}</span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Invoice PDF',
    cell: ({row}) => {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || 'https://api.upbeat.africa';
      const pdfUrl = `${apiBase}/invoices/v1/${row.original.id}/pdf`;

      return (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 rounded-sm text-xs text-primary hover:bg-primary/5">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`invoice-${row.original.id}.pdf`}
            title="Download PDF">
            <Download className="h-3.5 w-3.5" />
          </a>
        </Button>
      );
    },
  },
];
