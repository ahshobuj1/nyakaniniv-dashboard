import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionsTable } from './TransactionsTable';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { TransactionStatus, PaymentGateway } from './type';
import type { TTransaction } from './type';

export default function Transactions() {
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [gatewayFilter, setGatewayFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'all' | 'SUBSCRIPTION' | 'BOOKING'>('all');

    // Transaction details modal state
    const [selectedTransaction, setSelectedTransaction] = useState<TTransaction | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'amount', label: 'Amount' },
        { value: 'status', label: 'Status' },
        { value: 'updatedAt', label: 'Last Updated' },
    ];

    const handleSearch = () => setQuery(search);
    const handleSort = (value: string) => setSort(value);
    const handleSortOrder = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

    const handleViewDetails = (transaction: TTransaction) => {
        setSelectedTransaction(transaction);
        setDetailsOpen(true);
    };

    const tableProps = {
        searchQuery: query,
        sortQuery: sort,
        sortOrder,
        statusFilter,
        gatewayFilter,
        onViewDetails: handleViewDetails,
    };

    return (
        <div className="p-2">
            <header className="flex flex-col gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage and monitor all payments across subscriptions and bookings.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <Input
                                id="transactions-search"
                                placeholder="Search by email or ID..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                className="w-full lg:w-64"
                            />
                            <Button onClick={handleSearch} id="transactions-search-btn">
                                Search
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Filters */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Object.values(TransactionStatus).map(status => (
                                    <SelectItem key={status} value={status}>
                                        <span className="capitalize">{status}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Gateway" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                {Object.values(PaymentGateway).map(gateway => (
                                    <SelectItem key={gateway} value={gateway}>
                                        <span className="capitalize">
                                            {gateway.replace('_', ' ')}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sorting */}
                        <Select onValueChange={handleSort} value={sort}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleSortOrder} size="icon" variant="outline" id="transactions-sort-order-btn">
                            {sortOrder === 'asc' ? (
                                <ArrowUpNarrowWide className="h-4 w-4" />
                            ) : (
                                <ArrowDownNarrowWide className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Tabs for Subscription vs Booking separation */}
            <Tabs
                value={activeTab}
                onValueChange={v => setActiveTab(v as typeof activeTab)}
            >
                <TabsList className="mb-4" id="transactions-type-tabs">
                    <TabsTrigger value="all" id="transactions-tab-all">All</TabsTrigger>
                    <TabsTrigger value="SUBSCRIPTION" id="transactions-tab-subscription">
                        Subscription Payments
                    </TabsTrigger>
                    <TabsTrigger value="BOOKING" id="transactions-tab-booking">
                        Event Booking Payments
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <TransactionsTable {...tableProps} typeFilter="all" />
                </TabsContent>

                <TabsContent value="SUBSCRIPTION">
                    <TransactionsTable {...tableProps} typeFilter="SUBSCRIPTION" />
                </TabsContent>

                <TabsContent value="BOOKING">
                    <TransactionsTable {...tableProps} typeFilter="BOOKING" />
                </TabsContent>
            </Tabs>

            {/* Transaction Details Modal */}
            <TransactionDetailsModal
                transaction={selectedTransaction}
                open={detailsOpen}
                onClose={() => {
                    setDetailsOpen(false);
                    setSelectedTransaction(null);
                }}
            />
        </div>
    );
}
