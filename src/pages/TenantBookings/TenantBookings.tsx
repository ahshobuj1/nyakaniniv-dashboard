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
import TenantBookingsTable from './TenantBookingsTable';

export default function TenantBookings() {
  const {tenantId} = useParams<{tenantId?: string}>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortOptions = [
    {value: 'createdAt', label: 'Booked Date'},
    {value: 'eventDate', label: 'Event Date'},
    {value: 'totalAmount', label: 'Amount'},
    {value: 'status', label: 'Status'},
    {value: 'eventType', label: 'Event Type'},
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
            <h1 className="text-2xl font-bold tracking-tight">Tenant Bookings</h1>
            <p className="text-xs text-muted-foreground">
              {tenantId ? `Viewing bookings for tenant: ${tenantId}` : 'All tenant bookings'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select onValueChange={handleSort} value={sort}>
            <SelectTrigger className="w-[160px]">
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
            placeholder="Search event, client, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-[200px]"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </header>

      <TenantBookingsTable
        tenantId={tenantId}
        searchQuery={query}
        sortQuery={sort}
        sortOrder={sortOrder}
      />
    </div>
  );
}

