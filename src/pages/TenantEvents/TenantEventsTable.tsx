import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetTenantEventsQuery} from '@/features/events/eventsApi';

export default function TenantEventsTable({
  tenantId,
  searchQuery,
  sortQuery,
  sortOrder,
  statusFilter,
}: {
  tenantId: string;
  searchQuery: string;
  sortQuery: string;
  sortOrder: string;
  statusFilter?: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetTenantEventsQuery({
    tenantId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery || undefined,
    sortBy: sortQuery,
    sortOrder,
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
  });

  const totalRows = data?.meta?.pagination?.total ?? (data?.meta as {total?: number})?.total ?? 0;
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
      emptyMessage="No events available for this tenant."
    />
  );
}

