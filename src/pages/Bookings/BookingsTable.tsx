import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetAllBookingsQuery} from '@/features/bookings/bookingsApi';

export function BookingsTable({
  searchQuery,
  sortQuery,
  sortOrder,
  statusFilter,
}: {
  searchQuery: string;
  sortQuery: string;
  sortOrder: 'asc' | 'desc';
  statusFilter?: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetAllBookingsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery || undefined,
    sort: sortOrder === 'desc' ? `-${sortQuery}` : sortQuery,
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
  });

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
      emptyMessage="No bookings found across the platform."
    />
  );
}

