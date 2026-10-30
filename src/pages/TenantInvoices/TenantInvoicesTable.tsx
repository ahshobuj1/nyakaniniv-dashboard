import React from 'react';
import {columns} from './Columns';
import {DataTable} from '../DataTable';
import {useGetAllInvoicesQuery} from '@/features/invoices/invoicesApi';

export default function TenantInvoicesTable({
  tenantId,
  searchQuery,
  sortQuery,
  sortOrder,
  statusFilter,
  typeFilter,
}: {
  tenantId?: string;
  searchQuery: string;
  sortQuery: string;
  sortOrder: string;
  statusFilter?: string;
  typeFilter?: string;
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {data, isLoading} = useGetAllInvoicesQuery({
    tenantId: tenantId || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchQuery || undefined,
    sortBy: sortQuery,
    sortOrder,
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
    type: typeFilter && typeFilter !== 'all' ? typeFilter : undefined,
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
      emptyMessage="No invoices available for this tenant."
    />
  );
}

