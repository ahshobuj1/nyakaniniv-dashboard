import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, XCircle, CheckCircle2, CreditCard } from 'lucide-react';
import type { SubscriptionStats } from '@/features/analytics/type';

interface SubscriptionDistributionCardProps {
  subscriptions?: SubscriptionStats;
}

export function SubscriptionDistributionCard({ subscriptions }: SubscriptionDistributionCardProps) {
  const active = subscriptions?.active ?? 0;
  const pastDue = subscriptions?.pastDue ?? 0;
  const canceled = subscriptions?.canceled ?? 0;
  const total = active + pastDue + canceled;

  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const pastDuePercent = total > 0 ? Math.round((pastDue / total) * 100) : 0;
  const canceledPercent = total > 0 ? Math.round((canceled / total) * 100) : 0;

  const chartData = [
    { name: 'Active Subscriptions', value: active, color: '#10b981' },
    { name: 'Past Due / Unpaid', value: pastDue, color: '#f59e0b' },
    { name: 'Canceled / Inactive', value: canceled, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  return (
    <Card className="border border-border/60 bg-card overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            Subscription Health & Churn
          </CardTitle>
          <Badge
            variant="outline"
            className="text-xs font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {activePercent}% Active Rate
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Real-time status of tenant recurring subscription plans
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
        {total === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            <CreditCard size={32} className="mx-auto mb-2 opacity-40" />
            <p>No subscription records active yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visual Ring / Donut Chart */}
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active: isTooltipActive, payload }) => {
                      if (isTooltipActive && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="bg-popover border border-border p-2.5 rounded-lg shadow-xl text-xs">
                            <span className="font-semibold text-foreground block">{item.name}</span>
                            <span className="font-bold text-sm" style={{ color: item.payload.color }}>
                              {item.value} ({Math.round(((item.value as number) / total) * 100)}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-foreground">{total}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Total</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span className="font-medium text-foreground">Active Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{active}</span>
                  <span className="text-muted-foreground">({activePercent}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                  <span className="font-medium text-foreground">Past Due / Grace</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{pastDue}</span>
                  <span className="text-muted-foreground">({pastDuePercent}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2">
                  <XCircle size={15} className="text-red-500 shrink-0" />
                  <span className="font-medium text-foreground">Canceled Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{canceled}</span>
                  <span className="text-muted-foreground">({canceledPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
