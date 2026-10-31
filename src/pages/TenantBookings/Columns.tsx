import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Link} from 'react-router';
import {Eye} from 'lucide-react';
import defaultAvatar from '@/assets/default-image.jpg';
import {formatDate} from '@/utils/formatDate';
import type {Booking} from './type';

function getStatusBadge(status: string) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return (
        <Badge className="bg-emerald-600 text-white capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="secondary" className="capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'CANCELLED':
    case 'REJECTED':
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

function getPaymentBadge(status: string) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'PAID':
    case 'COMPLETED':
      return (
        <Badge className="bg-emerald-600 text-white capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="secondary" className="capitalize">
          {s.toLowerCase()}
        </Badge>
      );
    case 'FAILED':
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

export const columns: ColumnDef<Booking>[] = [
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
    header: 'Client',
    cell: ({row}) => {
      const client = row.original.client;
      const name = client?.name || 'Guest Client';
      const email = client?.email || 'No email provided';
      const phone = client?.phone;

      return (
        <div className="flex flex-col py-1 gap-0.5">
          <span className="font-semibold text-sm text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
          {phone ? (
            <span className="text-[11px] text-muted-foreground/80">
              {phone}
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    header: 'Event / Type',
    cell: ({row}) => {
      const eventType = row.original.eventType || 'Event';
      const address = row.original.address;
      return (
        <div className="flex flex-col gap-0.5 max-w-[200px]">
          <span className="font-medium text-sm text-foreground capitalize truncate">
            {eventType}
          </span>
          {address ? (
            <span
              className="text-xs text-muted-foreground truncate"
              title={address}>
              {address}
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    header: 'Tenant',
    cell: ({row}) => {
      const tenant = row.original.tenant;
      const stageName = tenant?.stageName || 'DJ Profile';
      const avatarSrc =
        tenant?.logoUrl || tenant?.user?.profileImg || defaultAvatar;

      return (
        <div className="flex items-center gap-2.5 py-1">
          <img
            src={avatarSrc}
            alt={stageName}
            className="h-8 w-8 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium text-xs leading-none text-foreground">
              {stageName}
            </span>
            {tenant?.subdomain ? (
              <a
                href={`https://${tenant.subdomain}.deejay.africa`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary hover:underline font-mono mt-0.5">
                {tenant.subdomain}
              </a>
            ) : null}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({row}) => {
      const amount = Number(row.original.totalAmount || 0);
      const curr = row.original.currencyCode || 'KES';
      return (
        <span className="font-semibold text-sm font-mono">
          {curr} {amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: 'eventDate',
    header: 'Event Date',
    cell: ({row}) => {
      const d = row.original.eventDate;
      if (!d) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="text-xs text-muted-foreground">{formatDate(d)}</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Booking Status',
    cell: ({row}) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({row}) => getPaymentBadge(row.original.paymentStatus),
  },
  {
    accessorKey: 'createdAt',
    header: 'Booked On',
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
    header: 'Actions',
    cell: ({row}) => (
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/5">
        <Link to={`/dashboard/bookings/${row.original.id}`}>
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </Link>
      </Button>
    ),
  },
];
