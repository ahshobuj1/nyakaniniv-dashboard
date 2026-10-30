/* eslint-disable react-refresh/only-export-components */
import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {ExternalLink} from 'lucide-react';
import {Link} from 'react-router';
import defaultAvatar from '@/assets/default-image.jpg';
import {PlanBadge} from '@/components/common/PlanBadge';
import type {Tenant} from './type';

function CountBadgeLink({to, count}: {to: string; count: number}) {
  const hasCount = count > 0;
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center font-semibold text-xs px-2.5 py-1 min-w-[2rem] rounded bg-muted hover:bg-primary hover:text-white transition-colors ${
        hasCount ? 'text-pink-600 font-bold' : 'text-muted-foreground'
      }`}>
      {count}
    </Link>
  );
}

export const columns: ColumnDef<Tenant>[] = [
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
    header: 'Tenant (User)',
    cell: ({row}) => {
      const user = row.original.user;
      const stageName = row.original.stageName;
      const avatarSrc =
        row.original.logoUrl || user?.profileImg || defaultAvatar;
      const displayName =
        stageName ||
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
        'Unknown DJ';

      return (
        <div className="flex items-center gap-3 py-1">
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium leading-none text-foreground">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    header: 'Portfolio URL',
    cell: ({row}) => {
      const subdomain = row.original.subdomain;
      const url = `https://${subdomain}.deejay.africa`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline hover:text-primary/80">
          <span>{subdomain}.deejay.africa</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
        </a>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({row}) => {
      const isActive = row.original.isActive;
      return isActive ? (
        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs">
          Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Inactive
        </Badge>
      );
    },
  },
  {
    accessorKey: 'activePlanName',
    header: 'Plan',
    cell: ({row}) => <PlanBadge name={row.original.activePlanName} />,
  },
  {
    id: 'bookings',
    header: 'Bookings',
    cell: ({row}) => (
      <CountBadgeLink
        to={`/dashboard/tenants/${row.original.id}/bookings`}
        count={row.original._count?.bookings || 0}
      />
    ),
  },
  {
    id: 'invoices',
    header: 'Invoices',
    cell: ({row}) => (
      <CountBadgeLink
        to={`/dashboard/tenants/${row.original.id}/invoices`}
        count={row.original._count?.invoices || 0}
      />
    ),
  },
  {
    id: 'clients',
    header: 'Clients',
    cell: ({row}) => (
      <CountBadgeLink
        to={`/dashboard/tenants/${row.original.id}/clients`}
        count={row.original._count?.clients || 0}
      />
    ),
  },
  {
    id: 'events',
    header: 'Events',
    cell: ({row}) => (
      <CountBadgeLink
        to={`/dashboard/tenants/${row.original.id}/events`}
        count={row.original._count?.events || 0}
      />
    ),
  },
  {
    id: 'mixTapes',
    header: 'Mixtapes',
    cell: ({row}) => (
      <CountBadgeLink
        to={`/dashboard/tenants/${row.original.id}/mixtapes`}
        count={row.original._count?.mixTapes || 0}
      />
    ),
  },
];
