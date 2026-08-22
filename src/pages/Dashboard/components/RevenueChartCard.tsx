import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar } from 'lucide-react';
import type { MonthlyRevenueData } from '@/features/analytics/type';

interface RevenueChartCardProps {
  data?: MonthlyRevenueData[];
}

export function RevenueChartCard({ data = [] }: RevenueChartCardProps) {
  // Format month (e.g., '2026-08' -> 'Aug 2026')
  const formattedData = data.map((item) => {
    let label = item.month;
    try {
      const [year, month] = item.month.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } catch {
      label = item.month;
    }
    return {
      rawMonth: item.month,
      month: label,
      amount: Number(item.amount) || 0,
    };
  });

  const totalPeriodRevenue = formattedData.reduce((acc, curr) => acc + curr.amount, 0);
  const maxRevenue = formattedData.length > 0 ? Math.max(...formattedData.map((d) => d.amount)) : 0;
  const avgMonthly = formattedData.length > 0 ? totalPeriodRevenue / formattedData.length : 0;

  return (
    <Card className="border border-border/60 bg-card overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Monthly Revenue Performance
              </CardTitle>
              <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/20 bg-primary/5">
                Subscriptions
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Monthly subscription fees generated from DJ platform plans
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Total Period</span>
              <p className="text-base font-bold text-foreground">
                ${totalPeriodRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Mini stats pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/40 text-xs">
          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/30">
            <span className="text-muted-foreground block text-[11px]">Monthly Average</span>
            <span className="font-semibold text-foreground text-sm">
              ${avgMonthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/30">
            <span className="text-muted-foreground block text-[11px]">Peak Month</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
              ${maxRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="hidden sm:block bg-muted/40 p-2.5 rounded-lg border border-border/30">
            <span className="text-muted-foreground block text-[11px]">Active Cycle</span>
            <span className="font-semibold text-foreground text-sm">Last 12 Months</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {formattedData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-sm">
            <Calendar size={32} className="mb-2 opacity-40" />
            <p>No revenue records found for this period</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f63131" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f63131" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  width={48}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(val) => {
                    const num = Number(val);
                    if (num >= 1000) {
                      return `$${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`;
                    }
                    return `$${num}`;
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const amount = payload[0].value as number;
                      return (
                        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-foreground mb-1">{label}</p>
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                            <DollarSign size={14} />
                            <span>${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            Subscription Billings
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f63131"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: '#f63131', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#f63131', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
