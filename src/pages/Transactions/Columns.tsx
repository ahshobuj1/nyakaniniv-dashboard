import type {ColumnDef} from '@tanstack/react-table';
import type {TTransaction} from './type';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {formatDate} from '@/utils/formatDate';
import {Link} from 'react-router';
import {Eye, Download} from 'lucide-react';
import {PlanBadge} from '@/components/common/PlanBadge';

export function getColumns(
  onViewDetails?: (transaction: TTransaction) => void,
): ColumnDef<TTransaction>[] {
  return [
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
      id: 'invoiceNumber',
      header: 'Invoice #',
      cell: ({row}) => {
        const invId = `INV-${row.original.id.slice(0, 8).toUpperCase()}`;
        return (
          <span className="font-mono text-xs font-semibold text-foreground">
            {invId}
          </span>
        );
      },
    },
    {
      id: 'customer',
      header: 'Tenant / User',
      cell: ({row}) => {
        const email =
          row.original.user?.email || row.original.booking?.client?.email;
        const name = row.original.user
          ? `${row.original.user?.firstName || ''} ${row.original.user?.lastName || ''}`.trim()
          : row.original.booking?.client?.name;

        return (
          <div className="flex flex-col py-1 gap-0.5 max-w-[200px]">
            <span className="font-semibold text-sm text-foreground truncate">
              {name || 'Tenant User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {email || 'No email'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'plan',
      header: 'Plan',
      cell: ({row}) => (
        <PlanBadge
          name={
            row.original.plan?.name ||
            (row.original.type === 'BOOKING' ? 'Booking' : 'Standard')
          }
        />
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({row}) => {
        const amount = Number(row.original.amount || 0);
        const curr = row.original.currency || 'KES';
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
      cell: ({row}) => {
        const status = (row.original.status || 'PENDING').toUpperCase();
        switch (status) {
          case 'PAID':
          case 'COMPLETED':
            return (
              <Badge className="bg-emerald-600 text-white capitalize">
                {status.toLowerCase()}
              </Badge>
            );
          case 'PENDING':
          case 'UNPAID':
            return (
              <Badge variant="secondary" className="capitalize">
                {status.toLowerCase()}
              </Badge>
            );
          case 'FAILED':
          case 'CANCELLED':
          case 'OVERDUE':
            return (
              <Badge variant="destructive" className="capitalize">
                {status.toLowerCase()}
              </Badge>
            );
          default:
            return (
              <Badge variant="outline" className="capitalize">
                {status.toLowerCase()}
              </Badge>
            );
        }
      },
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
      header: 'Date',
      cell: ({row}) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {formatDate(row.original.createdAt)}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            {new Date(row.original.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({row}) => {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';
        const pdfUrl = `${apiBase}/invoices/v1/${row.original.id}/pdf`;

        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 gap-1.5 text-xs text-primary hover:bg-primary/5">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={`invoice-${row.original.id}.pdf`}
                title="Download Invoice PDF">
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>

            {onViewDetails ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                id={`view-transaction-${row.original.id}`}
                title="View Details"
                onClick={() => onViewDetails(row.original)}>
                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
                id={`view-transaction-${row.original.id}`}
                title="View Details">
                <Link to={`/dashboard/transactions/${row.original.id}`}>
                  <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Link>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}

export const columns = getColumns();
