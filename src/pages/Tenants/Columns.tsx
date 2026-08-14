import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import type {Tenant} from './type';

export const columns: ColumnDef<Tenant>[] = [
  {
    header: 'Tenant (User)',
    cell: ({row}) => {
      const user = row.original.user;
      const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown';

      return (
        <div className="flex flex-col">
          <span className="font-medium leading-none">{displayName}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      );
    },
  },
  {
    header: 'Subdomain',
    cell: ({row}) => {
      const subdomain = row.original.subdomain;
      const url = `https://${subdomain}.deejay.africa`;
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {subdomain}.deejay.africa
        </a>
      );
    },
  },
  {
    accessorKey: 'stageName',
    header: 'Stage Name',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({row}) => {
      const isActive = row.original.isActive;
      return isActive ? (
        <Badge className="bg-green-600 text-white">Active</Badge>
      ) : (
        <Badge variant="outline">Inactive</Badge>
      );
    },
  },
  {
    accessorKey: 'activePlanName',
    header: 'Plan',
    cell: ({row}) => {
      const planName = row.original.activePlanName;
      return <Badge className="bg-purple-600 text-white">{planName}</Badge>;
    },
  },
  {
    header: 'Stats (Counts)',
    cell: ({row}) => {
      const counts = row.original._count;
      return (
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>Mixtapes: {counts?.mixTapes || 0}</span>
          <span>Events: {counts?.events || 0}</span>
          <span>Bookings: {counts?.bookings || 0}</span>
        </div>
      );
    },
  }
];
