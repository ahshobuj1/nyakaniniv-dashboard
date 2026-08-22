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
import {ArrowDownNarrowWide, ArrowUpNarrowWide} from 'lucide-react';
import PlanTable from './PlanTable';
import CreatePlan from './CreatePlan';
// import CreatePlan from './CreatePlan';

import {useAuth} from '@/hooks/useAuth';
import {UserRole} from '@/types/role';

export default function Plan() {
  const {role} = useAuth();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // ✅ Sorting options array
  const sortOptions = [
    {value: 'name', label: 'Name'},
    {value: 'priceMonthly', label: 'Monthly Price'},
    {value: 'priceAnnually', label: 'Annual Price'},
    {value: 'createdAt', label: 'Created At'},
    {value: 'updatedAt', label: 'Updated At'},
  ];

  const handleSearch = () => setQuery(search);
  const handleSort = (value: string) => setSort(value);
  const handleSortOrder = () =>
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  return (
    <div className="p-2">
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Plans</h1>
        <div className="flex items-center gap-2">
          <Select onValueChange={handleSort} value={sort}>
            <SelectTrigger className="w-[180px]">
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
              <ArrowUpNarrowWide />
            ) : (
              <ArrowDownNarrowWide />
            )}
          </Button>

          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
          {role === UserRole.SUPER_ADMIN && (
            <CreatePlan trigger={<Button>+ Create Plan</Button>} />
          )}
        </div>
      </header>

      <PlanTable searchQuery={query} sortQuery={sort} sortOrder={sortOrder} />
    </div>
  );
}
