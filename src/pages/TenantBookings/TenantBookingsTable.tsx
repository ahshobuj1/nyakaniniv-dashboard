import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetAllBookingsQuery} from '@/features/bookings/bookingsApi';

export default function TenantBookingsTable({
  tenantId,
  searchQuery,
  sortQuery,
  sortOrder,
}: {
  tenantId?: string;
  searchQuery: string;
  sortQuery: string;
  sortOrder: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetAllBookingsQuery({
    tenantId: tenantId || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery,
    sort: sortOrder === 'desc' ? `-${sortQuery}` : sortQuery,
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
      emptyMessage="No bookings available for this tenant."
    />
  );
}
