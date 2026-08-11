import React from 'react';
import {DataTable} from '../DataTable';
import {columns} from './Columns';
import {usePlansQuery} from '@/features/plans/plansApi';

export default function PlanTable({
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

  const {data, isLoading} = usePlansQuery({ all: true });
  let plansList = data?.data ?? [];

  // Client-side search filtering
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    plansList = plansList.filter((plan: any) =>
      plan.name?.toLowerCase().includes(lowerQuery)
    );
  }

  // Client-side sorting
  if (sortQuery) {
    plansList = [...plansList].sort((a: any, b: any) => {
      const aVal = a[sortQuery];
      const bVal = b[sortQuery];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalRows = plansList.length;
  const totalPages = Math.ceil(totalRows / pagination.pageSize);

  // Client-side pagination since backend returns all plans
  const paginatedData = plansList.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  return (
    <div className="overflow-hidden rounded-md border">
      <DataTable
        columns={columns}
        data={paginatedData}
        totalRows={totalRows}
        totalPages={totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
