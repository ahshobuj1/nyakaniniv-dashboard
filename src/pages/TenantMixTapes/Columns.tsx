import type {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {Music, ExternalLink} from 'lucide-react';
import defaultAvatar from '@/assets/default-image.jpg';
import {formatDate} from '@/utils/formatDate';
import type {MixTapeItem} from './type';

export const columns: ColumnDef<MixTapeItem>[] = [
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
    id: 'cover',
    header: 'Cover',
    cell: ({row}) => {
      const coverUrl = row.original.coverUrl;
      const title = row.original.title || 'Mixtape';

      return (
        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border flex items-center justify-center shrink-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          ) : (
            <Music className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({row}) => {
      const title = row.original.title || 'Untitled Mixtape';
      return (
        <div className="flex flex-col py-1 max-w-[240px]">
          <span className="font-semibold text-sm text-foreground truncate" title={title}>
            {title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'order',
    header: 'Display Order',
    cell: ({row}) => {
      const order = row.original.order;
      if (order === null || order === undefined) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }
      return <span className="font-mono text-xs text-muted-foreground">#{order}</span>;
    },
  },
  {
    id: 'audio',
    header: 'Audio Stream',
    cell: ({row}) => {
      const audioUrl = row.original.audioUrl;
      if (!audioUrl) return <span className="text-muted-foreground text-xs">—</span>;

      return (
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5">
          <a href={audioUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Play / Open</span>
          </a>
        </Button>
      );
    },
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

