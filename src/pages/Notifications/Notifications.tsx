import {useState, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {DataTable} from '../DataTable';
import {getColumns} from './Columns';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/features/notifications/notificationsApi';
import type {TNotification, GetNotificationsParams} from '@/features/notifications/type';
import {getNotificationMeta} from '@/components/notifications/notificationUtils';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  CheckCheck,
  Search,
  FilterX,
  CreditCard,
  Headphones,
  Calendar,
  Disc,
} from 'lucide-react';
import {cn} from '@/lib/utils';

const categoryTabs = [
  {id: 'all', label: 'All Alerts'},
  {id: 'payments', label: 'Payments & Subscriptions', icon: CreditCard},
  {id: 'support', label: 'Support Tickets', icon: Headphones},
  {id: 'bookings', label: 'Bookings', icon: Calendar},
  {id: 'tenants', label: 'DJ Tenants', icon: Disc},
] as const;

export default function Notifications() {
  const navigate = useNavigate();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pagination state (0-indexed for DataTable)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Queries & Mutations
  const {data: unreadData} = useGetUnreadCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  const {data, isLoading} = useGetNotificationsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: query || undefined,
    category: category === 'all' ? undefined : (category as GetNotificationsParams['category']),
    isRead: statusFilter === 'all' ? undefined : statusFilter === 'unread' ? false : true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, {isLoading: isMarkingAll}] = useMarkAllAsReadMutation();

  const notifications = useMemo(() => data?.data ?? [], [data?.data]);

  const totalRows =
    data?.meta?.pagination?.total ??
    data?.meta?.total ??
    notifications.length;

  const totalPages =
    data?.meta?.pagination?.totalPages ??
    data?.meta?.totalPages ??
    Math.ceil(totalRows / pagination.pageSize);

  const handleSearch = () => {
    setQuery(search);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleResetFilters = () => {
    setSearch('');
    setQuery('');
    setCategory('all');
    setStatusFilter('all');
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleViewDetails = useCallback(
    async (notif: TNotification) => {
      if (!notif.isRead) {
        try {
          await markAsRead(notif.id).unwrap();
        } catch {
          // silent catch
        }
      }
      const meta = getNotificationMeta(notif);
      navigate(meta.targetUrl);
    },
    [markAsRead, navigate]
  );

  const handleMarkOneRead = useCallback(
    async (id: string) => {
      try {
        await markAsRead(id).unwrap();
      } catch {
        // silent catch
      }
    },
    [markAsRead]
  );

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch {
      // silent catch
    }
  };

  const hasActiveFilters =
    query !== '' || category !== 'all' || statusFilter !== 'all';

  const columns = useMemo(
    () => getColumns(handleViewDetails, handleMarkOneRead),
    [handleViewDetails, handleMarkOneRead]
  );

  return (
    <div className="p-2 space-y-5">
      {/* Page Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-2xs">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Centralized platform alerts, subscription payments, support tickets, and bookings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="gap-1.5 cursor-pointer text-xs h-9"
              >
                <CheckCheck className="w-4 h-4 text-primary" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categoryTabs.map((tab) => {
            const Icon = 'icon' in tab ? tab.icon : null;
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategoryChange(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 border',
                  isActive
                    ? 'bg-foreground text-background font-semibold border-foreground shadow-xs'
                    : 'text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/70'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notifications by keyword, DJ, reference ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-9 text-xs bg-card"
            />
          </div>

          <Button
            size="sm"
            onClick={handleSearch}
            className="h-9 px-4 text-xs cursor-pointer"
          >
            Search
          </Button>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] h-9 text-xs bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="read">Read Only</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5 cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
      </header>

      {/* Notifications Table with Full Server-side Pagination */}
      <DataTable
        columns={columns}
        data={notifications}
        totalRows={totalRows}
        totalPages={totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage="No notifications found matching your criteria."
      />
    </div>
  );
}
