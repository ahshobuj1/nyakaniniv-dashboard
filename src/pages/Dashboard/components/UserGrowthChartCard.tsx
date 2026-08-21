import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus } from 'lucide-react';
import type { MonthlyUserGrowthData } from '@/features/analytics/type';

interface UserGrowthChartCardProps {
  data?: MonthlyUserGrowthData[];
}

export function UserGrowthChartCard({ data = [] }: UserGrowthChartCardProps) {
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
      count: Number(item.count) || 0,
    };
  });

  const totalNewUsers = formattedData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border border-border/60 bg-card overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                User Acquisition & Growth
              </CardTitle>
              <Badge variant="outline" className="text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/5">
                New Signups
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Monthly new user registrations on the ecosystem
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Total Acquired</span>
              <p className="text-base font-bold text-foreground">
                {totalNewUsers.toLocaleString()} Users
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {formattedData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-sm">
            <UserPlus size={32} className="mb-2 opacity-40" />
            <p>No user growth data recorded</p>
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
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
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const count = payload[0].value as number;
                      return (
                        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-foreground mb-1">{label}</p>
                          <div className="flex items-center gap-1.5 text-blue-500 font-semibold text-sm">
                            <UserPlus size={14} />
                            <span>{count} New Registrations</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#userBarGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
