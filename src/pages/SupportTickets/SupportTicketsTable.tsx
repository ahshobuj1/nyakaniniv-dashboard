import React from 'react';
import { DataTable } from '../DataTable';
import { columns } from './Columns';
import { useGetSupportTicketsQuery } from '@/features/support-tickets/supportTicketsApi';

export function SupportTicketsTable({
    searchQuery,
    statusFilter,
    priorityFilter,
    planFilter,
}: {
    searchQuery: string;
    statusFilter: string;
    priorityFilter: string;
    planFilter: string;
}) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Reset pagination when filters change
    React.useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [searchQuery, statusFilter, priorityFilter, planFilter]);

    const { data, isLoading } = useGetSupportTicketsQuery(
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter,
            priority: priorityFilter === 'all' ? undefined : priorityFilter,
            plan: planFilter === 'all' ? undefined : planFilter,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
        { refetchOnMountOrArgChange: true }
    );

    const totalRows = data?.meta?.pagination?.total ?? 0;
    const totalPages = Math.ceil(totalRows / pagination.pageSize);

    return (
        <DataTable
            columns={columns}
            data={data?.data ?? []}
            totalRows={totalRows}
            totalPages={totalPages}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={isLoading}
            emptyMessage="No support tickets found matching your criteria."
        />
    );
}
