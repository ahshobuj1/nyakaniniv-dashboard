import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SupportTicketsTable } from './SupportTicketsTable';
import { IconHeadphones } from '@tabler/icons-react';

const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

export default function SupportTickets() {
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleSearch = () => setQuery(search);

    return (
        <div className="p-2">
            <header className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <IconHeadphones className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Support Tickets</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage and resolve user-submitted support requests.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                    {/* Search */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <Input
                            id="support-ticket-search"
                            placeholder="Search by name, email, or subject..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full lg:w-72"
                        />
                        <Button onClick={handleSearch} id="support-ticket-search-btn">
                            Search
                        </Button>
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]" id="support-ticket-status-filter">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <SupportTicketsTable
                searchQuery={query}
                statusFilter={statusFilter}
            />
        </div>
    );
}
