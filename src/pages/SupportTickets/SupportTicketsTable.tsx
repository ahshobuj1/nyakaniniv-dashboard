import React from 'react';
import { DataTable } from '../DataTable';
import { columns } from './Columns';
import { useGetSupportTicketsQuery } from '@/features/support-tickets/supportTicketsApi';

export function SupportTicketsTable({
    searchQuery,
    statusFilter,
}: {
    searchQuery: string;
    statusFilter: string;
}) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useGetSupportTicketsQuery(
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter,
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
        />
    );
}
