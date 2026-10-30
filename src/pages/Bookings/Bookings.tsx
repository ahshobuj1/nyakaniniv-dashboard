import {useState} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {ArrowDownNarrowWide, ArrowUpNarrowWide} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {BookingsTable} from './BookingsTable';

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const sortOptions = [
    {value: 'createdAt', label: 'Booked Date'},
    {value: 'eventDate', label: 'Event Date'},
    {value: 'totalAmount', label: 'Amount'},
    {value: 'status', label: 'Booking Status'},
  ];

  const statusOptions = [
    {value: 'all', label: 'All Statuses'},
    {value: 'PENDING', label: 'Pending'},
    {value: 'ACCEPTED', label: 'Accepted / Quoted'},
    {value: 'CONFIRMED', label: 'Confirmed'},
    {value: 'IN_PROGRESS', label: 'In Progress'},
    {value: 'COMPLETED', label: 'Completed'},
    {value: 'CANCELLED', label: 'Cancelled'},
  ];

  const handleSearch = () => setQuery(search);
  const handleSort = (value: string) => setSort(value);
  const handleSortOrder = () =>
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  return (
    <div className="p-2">
      <header className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground text-sm">
            Monitor, audit, and inspect all event booking agreements across DJs and clients.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Input
                placeholder="Search ref, event, client, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full lg:w-72"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
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
              {sortOrder === 'asc' ? (
                <ArrowUpNarrowWide className="h-4 w-4" />
              ) : (
                <ArrowDownNarrowWide className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <BookingsTable
        searchQuery={query}
        sortQuery={sort}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
      />
    </div>
  );
}

