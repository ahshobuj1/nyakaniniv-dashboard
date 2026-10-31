import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {SupportTicketsTable} from './SupportTicketsTable';
import {IconHeadphones} from '@tabler/icons-react';
import {Zap, ShieldCheck, FilterX} from 'lucide-react';
import {useGetOpenTicketsCountQuery} from '@/features/support-tickets/supportTicketsApi';

const priorityOptions = [
  {value: 'all', label: 'All Tiers'},
  {value: 'priority', label: '⚡ Priority Support Only'},
  {value: 'standard', label: 'Standard Support'},
];

const planOptions = [
  {value: 'all', label: 'All Plans'},
  {value: 'Elite', label: 'Elite (Priority Support)'},
  {value: 'Pro', label: 'Pro Plan'},
  {value: 'Starter', label: 'Starter Plan'},
];

const statusOptions = [
  {value: 'all', label: 'All Statuses'},
  {value: 'open', label: 'Open'},
  {value: 'in_progress', label: 'In Progress'},
  {value: 'resolved', label: 'Resolved'},
  {value: 'closed', label: 'Closed'},
];

export default function SupportTickets() {
  const {data: openTicketsData} = useGetOpenTicketsCountQuery();
  const openCount = openTicketsData?.count ?? 0;

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const handleSearch = () => setQuery(search);

  const handleResetFilters = () => {
    setSearch('');
    setQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setPlanFilter('all');
  };

  const hasActiveFilters =
    query !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    planFilter !== 'all';

  return (
    <div className="p-2 space-y-5">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <IconHeadphones className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Support Tickets
                </h1>
                {openCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-2xs">
                    {openCount} Open
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                View, prioritize, and resolve user-submitted support inquiries
                with VIP tier routing.
              </p>
            </div>
          </div>

          {/* Quick Priority Queue Switcher */}
          <div className="flex items-center gap-2">
            <Button
              variant={priorityFilter === 'priority' ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setPriorityFilter((prev) =>
                  prev === 'priority' ? 'all' : 'priority',
                )
              }
              className={`gap-1.5 text-xs font-semibold ${
                priorityFilter === 'priority'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'border-amber-300 text-amber-800 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300'
              }`}>
              <Zap className="w-3.5 h-3.5 fill-current" />
              {priorityFilter === 'priority'
                ? 'Showing Priority Queue'
                : 'Filter Priority Only'}
            </Button>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center justify-between p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
          {/* Search */}
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <Input
              id="support-ticket-search"
              placeholder="Search name, email, subject, issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full xl:w-80 h-9 text-xs"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="h-9 px-4 text-xs font-medium"
              id="support-ticket-search-btn">
              Search
            </Button>
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Priority Tier Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Priority:
              </span>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger
                  className="w-[170px] h-9 text-xs bg-white"
                  id="support-ticket-priority-filter">
                  <div className="flex items-center gap-1.5 truncate">
                    {priorityFilter === 'priority' ? (
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-muted-foreground shrink-0" />
                    )}
                    <SelectValue placeholder="Priority Tier" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Plan:
              </span>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger
                  className="w-[150px] h-9 text-xs bg-white"
                  id="support-ticket-plan-filter">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-[140px] h-9 text-xs bg-white"
                  id="support-ticket-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
                title="Reset all filters">
                <FilterX className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </header>

      <SupportTicketsTable
        searchQuery={query}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        planFilter={planFilter}
      />
    </div>
  );
}
