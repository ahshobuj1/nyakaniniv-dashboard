import {useState, useMemo} from 'react';
import {useNavigate} from 'react-router';
import {Bell, CheckCheck, Search, X, Inbox, ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/features/notifications/notificationsApi';
import type {TNotification} from '@/features/notifications/type';
import {NotificationItem} from './NotificationItem';
import {getNotificationMeta} from './notificationUtils';
import {cn} from '@/lib/utils';

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const {data: unreadData} = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const unreadCount = unreadData?.count ?? 0;

  const {data: notificationsData, isLoading} = useGetNotificationsQuery(
    {
      limit: 30,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    {
      pollingInterval: 30000,
    },
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, {isLoading: isMarkingAll}] = useMarkAllAsReadMutation();

  const rawNotifications = useMemo(
    () => notificationsData?.data ?? [],
    [notificationsData?.data],
  );

  // Client-side filtering for search & unread
  const filteredNotifications = useMemo(() => {
    return rawNotifications.filter((n: TNotification) => {
      if (onlyUnread && n.isRead) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(q);
        const matchesMessage = n.message?.toLowerCase().includes(q);
        const matchesRef = n.referenceId?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMessage && !matchesRef) return false;
      }

      return true;
    });
  }, [rawNotifications, onlyUnread, search]);

  const handleNotificationClick = async (n: TNotification) => {
    if (!n.isRead) {
      try {
        await markAsRead(n.id).unwrap();
      } catch {
        // silent catch
      }
    }
    setOpen(false);
    const meta = getNotificationMeta(n);
    navigate(meta.targetUrl);
  };

  const handleMarkOneAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAsRead(id).unwrap();
    } catch {
      // silent catch
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch {
      // silent catch
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate('/dashboard/notifications');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-muted cursor-pointer transition-colors"
          aria-label="Open notifications">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[92vw] sm:w-[410px] p-0 shadow-2xl border border-border/70 rounded-xl overflow-hidden bg-card">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {unreadCount} new
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-normal text-muted-foreground bg-muted/50">
                Caught up
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2 font-normal cursor-pointer"
                title="Mark all as read">
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar & Unread toggle */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-background/80">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg placeholder:text-muted-foreground/60"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOnlyUnread(!onlyUnread)}
            className={cn(
              'text-[11px] px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 font-medium border',
              onlyUnread
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-semibold'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/70',
            )}>
            {onlyUnread ? 'Unread only' : 'All'}
          </button>
        </div>

        {/* Notification List with sleek thin scrollbar */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/20 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/15 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading alerts...</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground p-6 text-center">
              <div className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center mb-2">
                <Inbox className="w-4 h-4 text-muted-foreground/70" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                No alerts to show
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[220px]">
                {search || onlyUnread
                  ? 'No notifications match your active search criteria.'
                  : 'Platform events and alerts will appear here.'}
              </p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map((n: TNotification) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClick={handleNotificationClick}
                  onMarkAsRead={handleMarkOneAsRead}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with View All Notifications */}
        <div className="p-2 border-t border-border/50 bg-muted/15 flex items-center justify-between text-xs px-3.5">
          <span className="text-[11px] text-muted-foreground">
            {filteredNotifications.length} alerts
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="h-7 text-xs text-primary hover:text-primary/90 font-medium px-2 gap-1 cursor-pointer">
            View all notifications
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
