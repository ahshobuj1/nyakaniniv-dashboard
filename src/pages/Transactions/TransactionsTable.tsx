import React from 'react';
import { DataTable } from '../DataTable';
import { getColumns } from './Columns';
import { useGetTransactionsQuery } from '@/features/transactions/transactionsApi';
import type { TTransaction } from './type';

export function TransactionsTable({
    searchQuery,
    sortQuery,
    sortOrder,
    statusFilter,
    gatewayFilter,
    typeFilter,
    onViewDetails,
}: {
    searchQuery: string;
    sortQuery: string;
    sortOrder: 'asc' | 'desc';
    statusFilter?: string;
    gatewayFilter?: string;
    typeFilter?: string;
    onViewDetails: (transaction: TTransaction) => void;
}) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useGetTransactionsQuery(
        {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchQuery,
            sortBy: sortQuery,
            sortOrder,
            paymentStatus: statusFilter === 'all' ? undefined : statusFilter,
            paymentGateway: gatewayFilter === 'all' ? undefined : gatewayFilter,
            type: typeFilter === 'all' ? undefined : typeFilter,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const totalRows = data?.meta?.pagination?.total ?? 0;
    const totalPages = Math.ceil(totalRows / pagination.pageSize);

    const columns = React.useMemo(() => getColumns(onViewDetails), [onViewDetails]);

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
