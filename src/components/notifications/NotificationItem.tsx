import type {TNotification} from '@/features/notifications/type';
import {formatRelativeTime} from '@/utils/formatRelativeTime';
import {getNotificationMeta} from './notificationUtils';
import {cn} from '@/lib/utils';

interface NotificationItemProps {
  notification: TNotification;
  onClick: (notification: TNotification) => void;
  onMarkAsRead?: (id: string, e: React.MouseEvent) => void;
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
}: NotificationItemProps) {
  const meta = getNotificationMeta(notification);
  const Icon = meta.icon;
  const isUnread = !notification.isRead;

  return (
    <div
      onClick={() => onClick(notification)}
      className={cn(
        'group relative flex items-start gap-3 p-3 transition-colors cursor-pointer text-left',
        'hover:bg-muted/50 border-b border-border/40 last:border-b-0',
        isUnread ? 'bg-primary/[0.02]' : 'bg-transparent opacity-85 hover:opacity-100'
      )}
    >
      {/* Category Icon */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-border/50 transition-transform group-hover:scale-105',
          meta.iconBg,
          meta.iconColor
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                'text-xs truncate',
                isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
              )}
            >
              {notification.title}
            </span>
          </div>

          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <span
            className={cn(
              'inline-flex items-center text-[10px] font-medium px-1.5 py-0.2 rounded border uppercase tracking-wider',
              meta.pillBadge
            )}
          >
            {meta.category}
          </span>

          {notification.referenceId && (
            <span className="text-[10px] text-muted-foreground/70 font-mono truncate max-w-[140px]">
              #{notification.referenceId.slice(0, 8)}
            </span>
          )}
        </div>
      </div>

      {/* Unread indicator dot */}
      {isUnread && (
        <div className="shrink-0 flex items-center pt-1.5">
          <button
            type="button"
            title="Mark as read"
            onClick={(e) => onMarkAsRead?.(notification.id, e)}
            className="w-2 h-2 rounded-full bg-red-500 hover:scale-150 transition-transform"
          />
        </div>
      )}
    </div>
  );
}
