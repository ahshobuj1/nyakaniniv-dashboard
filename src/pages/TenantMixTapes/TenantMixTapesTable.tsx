import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetTenantMixTapesQuery} from '@/features/mixtapes/mixtapesApi';

export default function TenantMixTapesTable({
  tenantId,
  searchQuery,
  sortQuery,
  sortOrder,
}: {
  tenantId: string;
  searchQuery: string;
  sortQuery: string;
  sortOrder: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetTenantMixTapesQuery({
    tenantId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery || undefined,
    sortBy: sortQuery,
    sortOrder,
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
      emptyMessage="No mixtapes available for this tenant."
    />
  );
}

