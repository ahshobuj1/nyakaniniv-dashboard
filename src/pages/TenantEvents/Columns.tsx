import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {formatDate} from '@/utils/formatDate';
import type {EventItem} from './type';

function getEventStatusBadge(status?: string | null) {
  const s = (status || 'UPCOMING').toUpperCase();
  switch (s) {
    case 'COMPLETED':
      return <Badge className="bg-emerald-600 text-white capitalize">{s.toLowerCase()}</Badge>;
    case 'UPCOMING':
      return <Badge variant="secondary" className="capitalize text-primary bg-primary/10 border-primary/20">{s.toLowerCase()}</Badge>;
    case 'CANCELED':
    case 'CANCELLED':
      return <Badge variant="destructive" className="capitalize">{s.toLowerCase()}</Badge>;
    default:
      return <Badge variant="outline" className="capitalize">{s.toLowerCase()}</Badge>;
  }
}

export const columns: ColumnDef<EventItem>[] = [
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
    header: 'Event Title',
    cell: ({row}) => {
      const title = row.original.title || 'Untitled Event';
      const desc = row.original.description;
      return (
        <div className="flex flex-col py-1 gap-0.5 max-w-[220px]">
          <span className="font-semibold text-sm text-foreground truncate" title={title}>
            {title}
          </span>
          {desc ? (
            <span className="text-xs text-muted-foreground truncate" title={desc}>
              {desc}
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    header: 'Venue & Address',
    cell: ({row}) => {
      const venue = row.original.venueName || 'Venue TBD';
      const address = row.original.venueAddress;
      return (
        <div className="flex flex-col gap-0.5 max-w-[200px]">
          <span className="font-medium text-xs text-foreground truncate" title={venue}>
            {venue}
          </span>
          {address ? (
            <span className="text-[11px] text-muted-foreground truncate" title={address}>
              {address}
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'eventDate',
    header: 'Date & Time',
    cell: ({row}) => {
      const d = row.original.eventDate;
      const t = row.original.eventTime;
      if (!d) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">{formatDate(d)}</span>
          {t ? <span className="text-[11px] text-muted-foreground font-mono">{t}</span> : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({row}) => {
      const cap = row.original.capacity;
      if (cap === null || cap === undefined) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }
      return <span className="font-mono text-xs text-foreground">{cap.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => getEventStatusBadge(row.original.status),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created On',
    cell: ({row}) => {
      const d = row.original.createdAt;
      if (!d) return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="text-xs text-muted-foreground">{formatDate(d)}</span>;
    },
  },
];

