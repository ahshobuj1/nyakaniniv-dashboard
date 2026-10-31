import type {ColumnDef} from '@tanstack/react-table';
import type {TNotification} from '@/features/notifications/type';
import {Button} from '@/components/ui/button';
import {formatDate} from '@/utils/formatDate';
import {formatRelativeTime} from '@/utils/formatRelativeTime';
import {getNotificationMeta} from '@/components/notifications/notificationUtils';
import {Eye, Check} from 'lucide-react';
import {cn} from '@/lib/utils';

export function getColumns(
  onViewDetails: (notification: TNotification) => void,
  onMarkAsRead?: (id: string) => void,
): ColumnDef<TNotification>[] {
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
      id: 'status',
      header: 'Status',
      cell: ({row}) => {
        const isUnread = !row.original.isRead;
        return (
          <div className="flex items-center gap-1.5">
            {isUnread ? (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Unread
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-muted-foreground/50" />
                Read
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'category',
      header: 'Category',
      cell: ({row}) => {
        const meta = getNotificationMeta(row.original);
        const Icon = meta.icon;
        return (
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'w-6 h-6 rounded-md flex items-center justify-center shrink-0 border border-border/50',
                meta.iconBg,
                meta.iconColor
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider',
                meta.pillBadge
              )}
            >
              {meta.category}
            </span>
          </div>
        );
      },
    },
    {
      id: 'content',
      header: 'Notification',
      cell: ({row}) => {
        const notif = row.original;
        const isUnread = !notif.isRead;
        return (
          <div className="flex flex-col gap-0.5 max-w-[420px] py-1">
            <span
              className={cn(
                'text-xs truncate',
                isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'
              )}
            >
              {notif.title}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {notif.message}
            </span>
          </div>
        );
      },
    },
    {
      id: 'referenceId',
      header: 'Reference',
      cell: ({row}) => {
        const ref = row.original.referenceId;
        if (!ref) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }
        return (
          <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">
            #{ref.slice(0, 8)}
          </span>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Date & Time',
      cell: ({row}) => {
        const date = row.original.createdAt;
        return (
          <div className="flex flex-col text-xs text-muted-foreground whitespace-nowrap">
            <span className="font-medium text-foreground">
              {formatRelativeTime(date)}
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              {formatDate(date)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({row}) => {
        const notif = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            {!notif.isRead && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notif.id)}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                title="Mark as read"
              >
                <Check className="w-3.5 h-3.5" />
                Read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(notif)}
              className="h-8 text-xs gap-1 px-2.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              View
            </Button>
          </div>
        );
      },
    },
  ];
}

