import { Card, CardContent } from '@/components/ui/card';
import {
  DollarSign,
  Radio,
  Users,
  CalendarCheck2,
  TrendingUp,
} from 'lucide-react';
import type { AdminAnalyticsData } from '@/features/analytics/type';

interface OverviewStatsCardsProps {
  analytics?: AdminAnalyticsData;
}

export function OverviewStatsCards({ analytics }: OverviewStatsCardsProps) {
  const totalRevenue = analytics?.totalRevenue ?? 0;
  const totalTenants = analytics?.totalTenants ?? 0;
  const totalUsers = analytics?.totalUsers ?? 0;
  const totalBookings = analytics?.totalBookings ?? 0;
  const activeSubs = analytics?.subscriptions?.active ?? 0;

  const stats = [
    {
      title: 'Total Platform Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: `${activeSubs} active paid subscriptions`,
      icon: DollarSign,
      iconColor: 'text-emerald-500',
      // bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'hover:border-emerald-500/30',
    },
    {
      title: 'Total DJs / Portfolios',
      value: totalTenants.toLocaleString(),
      subtext: 'Active custom subdomain sites',
      icon: Radio,
      iconColor: 'text-primary',
      // bgGlow: 'from-primary/10 to-transparent',
      borderColor: 'hover:border-primary/30',
    },
    {
      title: 'Total Registered Users',
      value: totalUsers.toLocaleString(),
      subtext: 'DJs, Clients & Platform Admins',
      icon: Users,
      iconColor: 'text-blue-500',
      // bgGlow: 'from-blue-500/10 to-transparent',
      borderColor: 'hover:border-blue-500/30',
    },
    {
      title: 'Total DJ Bookings',
      value: totalBookings.toLocaleString(),
      subtext: 'Events & gigs arranged',
      icon: CalendarCheck2,
      iconColor: 'text-amber-500',
      // bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'hover:border-amber-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-md border border-border/60 ${stat.borderColor} bg-card`}>
            {/* Top gradient highlight */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r`} />

            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-muted/80 ${stat.iconColor} shrink-0`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                <span className="truncate">{stat.subtext}</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={12} />
                  <span>Active</span>
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
