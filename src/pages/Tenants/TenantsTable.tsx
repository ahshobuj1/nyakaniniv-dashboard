import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetAllTenantsQuery} from '@/features/tenants/tenantApi';

export default function TenantsTable({
  searchQuery,
  sortQuery,
  sortOrder,
}: {
  searchQuery: string;
  sortQuery: string;
  sortOrder: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetAllTenantsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery,
    sort: sortOrder === 'desc' ? `-${sortQuery}` : sortQuery,
  });

  const totalRows = data?.meta?.pagination?.total ?? 0;
  const totalPages = Math.ceil(totalRows / pagination.pageSize);

  return (
    <div className="overflow-hidden rounded-md border">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        totalRows={totalRows}
        totalPages={totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
