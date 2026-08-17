import type { ColumnDef } from '@tanstack/react-table';
import type { TTransaction } from './type';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';

export const columns: ColumnDef<TTransaction>[] = [
  {
    id: 'serialNumber',
    header: 'SN',
    cell: ({ row }) => (
      <div className="text-muted-foreground w-8">
        {row.index + 1}
      </div>
    ),
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const email = row.original.type === 'SUBSCRIPTION' 
        ? row.original.user?.email 
        : row.original.booking?.client?.email;
      const name = row.original.type === 'SUBSCRIPTION'
        ? `${row.original.user?.firstName || ''} ${row.original.user?.lastName || ''}`
        : row.original.booking?.client?.name;
      
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{name || 'N/A'}</span>
          <span className="text-xs text-muted-foreground">{email || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.original.amount} KES
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status || 'pending';
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'outline';

      switch (status.toLowerCase()) {
        case 'paid':
          variant = 'default';
          break;
        case 'pending':
          variant = 'secondary';
          break;
        case 'failed':
          variant = 'destructive';
          break;
        case 'cancelled':
          variant = 'destructive';
          break;
      }

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'method',
    header: 'Method',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize font-normal">
        {row.original.method?.replace('_', ' ') || 'Unknown'}
      </Badge>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const isSub = row.original.type === 'SUBSCRIPTION';
      const label = isSub ? `Subscription (${row.original.plan?.name || 'Plan'})` : `Booking (${row.original.tenant?.stageName || 'DJ'})`;
      return <span className="capitalize text-sm">{label}</span>;
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{formatDate(row.original.createdAt)}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleTimeString()}
        </span>
      </div>
    ),
  },
];
