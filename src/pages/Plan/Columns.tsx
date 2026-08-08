import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  ChevronsDown,
  ChevronsRight,
  Edit,
  MoreHorizontal,
  Trash,
} from 'lucide-react';
import {formatDate} from '@/utils/formatDate';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type {IPlan} from './type';
import EditPlan from './EditPlan';
import { useDeletePlanMutation } from '@/features/plans/plansApi';
import toast from 'react-hot-toast';

const PlanActionsCell = ({plan}: {plan: IPlan}) => {
  const [deletePlan] = useDeletePlanMutation();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deletePlan(plan.id).unwrap();
      toast.success('Plan deleted successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to delete plan');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="py-3">
        <EditPlan
          item={plan}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit Plan
            </DropdownMenuItem>
          }
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
          <Trash className="mr-2 h-4 w-4" /> Delete Plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<IPlan>[] = [
  //  SL
  {
    id: 'sl',
    header: '#',
    cell: ({row, table}) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;

      return pageIndex * pageSize + row.index + 1;
    },
  },

  //  Plan
  {
    header: 'Plan',
    cell: ({row}) => {
      const plan = row.original;
      return (
        <div className="flex flex-col max-w-[320px]">
          <span className="font-medium text-primary">{plan.name}</span>
        </div>
      );
    },
  },

  //  Price
  {
    header: 'Price',
    cell: ({row}) => {
      const plan = row.original;

      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            ${plan.priceMonthly}
            <span className="text-xs text-muted-foreground"> / month</span>
          </span>
          <span className="text-xs text-muted-foreground">
            ${plan.priceAnnually} / year
          </span>
        </div>
      );
    },
  },

  // Discount
  {
    header: 'Discount',
    cell: ({row}) => {
      const plan = row.original;
      if (!plan.discountPercentage) return <span className="text-muted-foreground">none</span>;
      return <Badge variant="secondary">{plan.discountPercentage}% off</Badge>;
    },
  },

  //  Features
  {
    header: 'Features',
    cell: ({row}) => {
      const features = row.original.features || {};
      const featureKeys = Object.keys(features);

      if (!featureKeys.length) {
        return <span className="text-muted-foreground pl-2">none</span>;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge variant="secondary" className="cursor-pointer select-none">
              {featureKeys.length} properties{' '}
              <ChevronsDown className="text-primary ml-1 w-4 h-4" />
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="max-w-[300px]">
            {featureKeys.map((key) => (
              <DropdownMenuItem key={key} className="flex justify-between">
                <span className="font-medium mr-4">{key}</span>
                <span className="text-muted-foreground">
                  {typeof features[key] === 'boolean'
                    ? features[key]
                      ? 'Yes'
                      : 'No'
                    : features[key]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },



  //  Created
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({row}) => formatDate(row.original.createdAt),
  },

  //  Actions
  {
    id: 'actions',
    header: 'Actions',
    cell: ({row}) => <PlanActionsCell plan={row.original} />,
  },
];
