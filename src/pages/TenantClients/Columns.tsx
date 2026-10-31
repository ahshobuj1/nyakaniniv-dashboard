import type {ColumnDef} from '@tanstack/react-table';
import defaultAvatar from '@/assets/default-image.jpg';
import {formatDate} from '@/utils/formatDate';
import type {Client} from './type';

export const columns: ColumnDef<Client>[] = [
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
      const name = row.original.name || 'Guest Client';
      const email = row.original.email || 'No email';
      return (
        <div className="flex flex-col py-1 gap-0.5 max-w-[200px]">
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
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({row}) => {
      const phone = row.original.phone;
      if (!phone)
        return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="font-mono text-xs text-foreground">{phone}</span>;
    },
  },
  {
    header: 'Tenant',
    cell: ({row}) => {
      const tenant = row.original.tenant;
      if (!tenant)
        return <span className="text-muted-foreground text-xs">—</span>;
      const stageName = tenant.stageName || 'DJ Profile';
      const avatarSrc =
        tenant.logoUrl || tenant.user?.profileImg || defaultAvatar;

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
            {tenant.subdomain ? (
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
    id: 'bookingsCount',
    header: 'Bookings',
    cell: ({row}) => {
      const count =
        row.original._count?.bookings ?? (row.original.bookings?.length || 0);
      return (
        <span
          className={`inline-flex items-center justify-center font-semibold text-xs px-2.5 py-1 min-w-[2rem] rounded bg-muted ${
            count > 0 ? 'text-pink-600 font-bold' : 'text-muted-foreground'
          }`}>
          {count}
        </span>
      );
    },
  },
  {
    id: 'latestBooking',
    header: 'Latest Booking',
    cell: ({row}) => {
      const latest = row.original.bookings?.[0];
      if (!latest)
        return <span className="text-muted-foreground text-xs">—</span>;

      return (
        <div className="flex flex-col gap-0.5 max-w-[180px]">
          <span className="font-medium text-xs text-foreground capitalize truncate">
            {latest.eventType || 'Event'}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {latest.eventDate ? formatDate(latest.eventDate) : 'No date'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined On',
    cell: ({row}) => {
      const d = row.original.createdAt;
      if (!d) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="text-xs text-muted-foreground">{formatDate(d)}</span>
      );
    },
  },
];
