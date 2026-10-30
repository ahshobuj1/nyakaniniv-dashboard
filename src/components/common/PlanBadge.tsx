import {Badge} from '@/components/ui/badge';
import {getPlanColorClasses} from '@/utils/planColors';

export interface PlanBadgeProps {
  name?: string | null;
  className?: string;
}

export function PlanBadge({name, className = ''}: PlanBadgeProps) {
  const planName = name?.trim() || 'No Plan';
  const colorClasses = getPlanColorClasses(name);

  return (
    <Badge
      variant="outline"
      className={`font-semibold text-xs capitalize ${colorClasses} ${className}`}>
      {planName}
    </Badge>
  );
}
