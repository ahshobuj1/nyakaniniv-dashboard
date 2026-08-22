import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, XCircle, CheckCircle2, CreditCard, Sparkles, Layers } from 'lucide-react';
import type { SubscriptionStats } from '@/features/analytics/type';

interface SubscriptionDistributionCardProps {
  subscriptions?: SubscriptionStats;
}

export function SubscriptionDistributionCard({ subscriptions }: SubscriptionDistributionCardProps) {
  const [tab, setTab] = useState<'plans' | 'status'>('plans');

  const active = subscriptions?.active ?? 0;
  const pastDue = subscriptions?.pastDue ?? 0;
  const canceled = subscriptions?.canceled ?? 0;
  const total = active + pastDue + canceled;

  const plans = subscriptions?.byPlan || [];
  const totalPlanPurchases = plans.reduce((acc, p) => acc + (p.totalPurchases || 0), 0);

  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const pastDuePercent = total > 0 ? Math.round((pastDue / total) * 100) : 0;
  const canceledPercent = total > 0 ? Math.round((canceled / total) * 100) : 0;

  const chartData = [
    { name: 'Active Subscriptions', value: active, color: '#10b981' },
    { name: 'Past Due / Unpaid', value: pastDue, color: '#f59e0b' },
    { name: 'Canceled / Inactive', value: canceled, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  const planColors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <Card className="border border-border/60 bg-card overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            Subscriptions
          </CardTitle>

          <Tabs value={tab} onValueChange={(v) => setTab(v as 'plans' | 'status')} className="w-auto">
            <TabsList className="h-7 p-0.5 bg-muted/60">
              <TabsTrigger value="plans" className="text-xs px-2.5 py-1 flex items-center gap-1">
                <Layers size={12} />
                <span>By Plan</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="text-xs px-2.5 py-1 flex items-center gap-1">
                <Sparkles size={12} />
                <span>Status</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {tab === 'plans'
            ? 'Plan-wise tenant subscription purchases & active subscribers'
            : 'Real-time health status of recurring tenant subscriptions'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
        {tab === 'plans' ? (
          plans.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <Layers size={32} className="mx-auto mb-2 opacity-40" />
              <p>No subscription plans data available</p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1 border-b border-border/40 font-medium">
                <span>Plan Tier</span>
                <span className="text-right">Active / Total Sold</span>
              </div>

              <div className="space-y-3">
                {plans.map((p, idx) => {
                  const color = planColors[idx % planColors.length];
                  const percentOfTotal =
                    totalPlanPurchases > 0 ? Math.round((p.totalPurchases / totalPlanPurchases) * 100) : 0;

                  return (
                    <div
                      key={p.planId}
                      className="p-3 rounded-lg bg-muted/30 border border-border/40 hover:border-border/80 transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-semibold text-xs text-foreground">{p.planName}</span>
                          <span className="text-[11px] text-muted-foreground">
                            ${Number(p.priceMonthly).toFixed(0)}/mo
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <Badge variant="outline" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 px-1.5 py-0">
                            {p.activeSubscribers} active
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            / {p.totalPurchases} sold
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(percentOfTotal, p.totalPurchases > 0 ? 5 : 0)}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-1 text-[10px] text-muted-foreground">
                        <span>{percentOfTotal}% of total purchases</span>
                        {!p.isActive && <span className="text-amber-500">Archived</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : total === 0 ? (
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

