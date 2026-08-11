import {useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  ChevronsDown,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import type {IPlan} from './type';
import EditPlan from './EditPlan';
import { useDeletePlanMutation, useUpdatePlanMutation } from '@/features/plans/plansApi';
import { toast } from 'sonner';

const PlanStatusCell = ({plan}: {plan: IPlan}) => {
  const [updatePlan] = useUpdatePlanMutation();

  const handleToggle = async (checked: boolean) => {
    try {
      await updatePlan({id: plan.id, data: {isActive: checked}}).unwrap();
      toast.success(`Successfully ${checked ? 'enabled' : 'disabled'} the plan "${plan.name}"`);
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update plan status');
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Switch checked={plan.isActive} onCheckedChange={handleToggle} />
      <span className={`text-xs font-semibold ${plan.isActive ? 'text-green-600' : 'text-gray-400'}`}>
        {plan.isActive ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
};

const PlanActionsCell = ({plan}: {plan: IPlan}) => {
  const [deletePlan] = useDeletePlanMutation();
  const [deleteInput, setDeleteInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePlan(plan.id).unwrap();
      toast.success('Plan deleted successfully');
      setIsOpen(false);
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to delete plan');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setDeleteInput(''); // reset on close
    }}>
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

        <AlertDialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">
            <Trash className="mr-2 h-4 w-4" /> Delete Plan
          </DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <p>
            This action cannot be undone. This will permanently delete the plan <span className="font-semibold text-foreground">"{plan.name}"</span>.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Please type <span className="font-bold text-destructive">delete</span> to confirm.
            </p>
            <Input 
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type delete here..."
              className="w-full cursor-pointer"
            />
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={(e) => {
            e.preventDefault();
            if (deleteInput.toLowerCase() === 'delete') {
              handleDelete();
            }
          }} 
          disabled={deleteInput.toLowerCase() !== 'delete'}
          className="bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
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
            KES {Number(plan.priceMonthly).toFixed(0)}
            <span className="text-xs text-muted-foreground"> / month</span>
          </span>
          <span className="text-xs text-muted-foreground">
            KES {Number(plan.priceAnnually).toFixed(0)} / year
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
      return <Badge variant="secondary" className='text-primary/80'>{plan.discountPercentage}% off</Badge>;
    },
  },

  // Status
  {
    header: 'Status',
    cell: ({row}) => <PlanStatusCell plan={row.original} />
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
