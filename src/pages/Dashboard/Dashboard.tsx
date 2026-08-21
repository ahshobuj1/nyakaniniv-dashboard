import {
  useGetAdminAnalyticsQuery,
  useGetAdminChartsQuery,
} from '@/features/analytics/analyticsApi';
import { DashboardHeader } from './components/DashboardHeader';
import { OverviewStatsCards } from './components/OverviewStatsCards';
import { RevenueChartCard } from './components/RevenueChartCard';
import { UserGrowthChartCard } from './components/UserGrowthChartCard';
import { SubscriptionDistributionCard } from './components/SubscriptionDistributionCard';
import { RecentBookingsCard } from './components/RecentBookingsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const {
    data: analyticsResponse,
    isLoading: isAnalyticsLoading,
    isFetching: isAnalyticsFetching,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGetAdminAnalyticsQuery();

  const {
    data: chartsResponse,
    isLoading: isChartsLoading,
    isFetching: isChartsFetching,
    error: chartsError,
    refetch: refetchCharts,
  } = useGetAdminChartsQuery();

  const handleRefresh = () => {
    refetchAnalytics();
    refetchCharts();
  };

  const isFetching = isAnalyticsFetching || isChartsFetching;
  const isLoading = isAnalyticsLoading || isChartsLoading;
  const hasError = !!analyticsError && !!chartsError;

  const analytics = analyticsResponse?.data;
  const charts = chartsResponse?.data;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-border/40">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))}
        </div>

        {/* Charts Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-5 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-5 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-6 text-center border-destructive/30">
          <CardContent className="space-y-4 pt-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-bold">Failed to load analytics</h2>
            <p className="text-sm text-muted-foreground">
              We encountered an issue connecting to the analytics engine. Please check your connection and retry.
            </p>
            <Button onClick={handleRefresh} className="gap-2 w-full">
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Header Banner */}
      <DashboardHeader onRefresh={handleRefresh} isFetching={isFetching} />

      {/* 4 Main KPI Cards */}
      <OverviewStatsCards analytics={analytics} />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChartCard data={charts?.revenueChart} />
        </div>
        <div className="lg:col-span-1">
          <SubscriptionDistributionCard subscriptions={analytics?.subscriptions} />
        </div>
      </div>

      {/* Secondary Row: User Acquisition + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UserGrowthChartCard data={charts?.usersGrowthChart} />
        </div>
        <div className="lg:col-span-2">
          <RecentBookingsCard bookings={analytics?.recentBookings} />
        </div>
      </div>
    </div>
  );
}
