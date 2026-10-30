import {useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {ArrowDownNarrowWide, ArrowUpNarrowWide, ArrowLeft} from 'lucide-react';
import TenantEventsTable from './TenantEventsTable';

export default function TenantEvents() {
  const {tenantId} = useParams<{tenantId: string}>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('eventDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('all');

  const sortOptions = [
    {value: 'eventDate', label: 'Event Date'},
    {value: 'createdAt', label: 'Created Date'},
    {value: 'title', label: 'Title'},
    {value: 'capacity', label: 'Capacity'},
  ];

  const statusOptions = [
    {value: 'all', label: 'All Statuses'},
    {value: 'upcoming', label: 'Upcoming'},
    {value: 'completed', label: 'Completed'},
    {value: 'canceled', label: 'Canceled'},
  ];

  const handleSearch = () => setQuery(search);
  const handleSort = (value: string) => setSort(value);
  const handleSortOrder = () =>
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  return (
    <div className="p-2">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard/tenants')}
            className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tenant Events</h1>
            <p className="text-xs text-muted-foreground">
              {tenantId ? `Viewing events for tenant: ${tenantId}` : 'All tenant events'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleSort} value={sort}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSortOrder} size="icon" variant="outline">
            {sortOrder === 'asc' ? <ArrowUpNarrowWide /> : <ArrowDownNarrowWide />}
          </Button>

          <Input
            placeholder="Search title, venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-[200px]"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </header>

      {tenantId ? (
        <TenantEventsTable
          tenantId={tenantId}
          searchQuery={query}
          sortQuery={sort}
          sortOrder={sortOrder}
          statusFilter={statusFilter}
        />
      ) : (
        <div className="p-8 text-center text-muted-foreground">No tenant specified.</div>
      )}
    </div>
  );
}

