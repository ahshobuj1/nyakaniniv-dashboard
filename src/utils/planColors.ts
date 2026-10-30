export function getPlanColorClasses(planName?: string | null): string {
  const lower = (planName || '').trim().toLowerCase();

  if (
    lower.includes('starter') ||
    lower.includes('basic') ||
    lower.includes('free')
  ) {
    return 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800';
  }
  if (lower.includes('pro')) {
    return 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
  }
  if (lower.includes('elite')) {
    return 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  }
  if (
    lower.includes('premium') ||
    lower.includes('enterprise') ||
    lower.includes('vip')
  ) {
    return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }
  if (lower.includes('standard')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  }

  return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800';
}

