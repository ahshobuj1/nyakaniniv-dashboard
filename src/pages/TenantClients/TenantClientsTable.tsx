import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetAllClientsQuery} from '@/features/clients/clientsApi';

export default function TenantClientsTable({
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

  const {data, isLoading} = useGetAllClientsQuery({
    tenantId: tenantId || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery || undefined,
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
      emptyMessage="No clients available for this tenant."
    />
  );
}

