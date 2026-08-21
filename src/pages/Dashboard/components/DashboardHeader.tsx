import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isFetching: boolean;
}

export function DashboardHeader({ onRefresh, isFetching }: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Platform Analytics & Overview
          </h1>
          <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1.5 py-0.5 px-2.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar size={14} className="text-muted-foreground/70" />
          <span>{currentDate}</span>
          <span className="text-muted-foreground/40">•</span>
          <span>UpBeat Entertainment Africa DJ Ecosystem Management</span>
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 gap-1.5 text-xs font-medium">
          <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary' : 'text-muted-foreground'} />
          <span>{isFetching ? 'Syncing...' : 'Refresh Data'}</span>
        </Button>
      </div>
    </div>
  );
}
