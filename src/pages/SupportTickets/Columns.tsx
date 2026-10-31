import type { ColumnDef } from '@tanstack/react-table';
import type { TSupportTicket } from '@/features/support-tickets/supportTicketsApi';
import { Zap, Disc } from 'lucide-react';
import { PlanBadge } from '@/components/common/PlanBadge';
import { StatusCell, ExpandCell, ActionCell } from './TicketCells';

export const columns: ColumnDef<TSupportTicket>[] = [
    {
        id: 'serialNumber',
        header: 'SN',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return (
                <div className="text-muted-foreground w-8 font-medium text-xs">
                    {pageIndex * pageSize + row.index + 1}
                </div>
            );
        },
    },
    {
        id: 'customer',
        header: 'Submitted By',
        cell: ({ row }) => {
            const stageName = row.original.tenant?.stageName || row.original.user?.tenant?.stageName;
            return (
                <div className="flex flex-col min-w-[160px]">
                    <span className="font-medium text-sm text-gray-900">{row.original.fullName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                    {stageName && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary/90 mt-0.5">
                            <Disc className="w-3 h-3 text-primary/80" />
                            DJ: {stageName}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'planPriority',
        header: 'Plan & Priority',
        cell: ({ row }) => {
            const planName = row.original.planName || row.original.user?.subscriptions?.[0]?.plan?.name || null;
            const isPriority =
                row.original.hasPrioritySupport ||
                row.original.priority === 'priority' ||
                planName?.toLowerCase() === 'elite';

            return (
                <div className="flex flex-col items-start gap-1 min-w-[130px]">
                    <PlanBadge name={planName} />
                    {isPriority ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700 shadow-2xs">
                            <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                            Priority Support
                        </span>
                    ) : (
                        <span className="text-[10px] text-muted-foreground font-medium">
                            Standard Support
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'issue',
        header: 'Subject & Description',
        cell: ({ row }) => <ExpandCell ticket={row.original} />,
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusCell ticket={row.original} />,
    },
    {
        accessorKey: 'createdAt',
        header: 'Submitted At',
        cell: ({ row }) => (
            <div className="flex flex-col text-sm min-w-[100px]">
                <span className="text-gray-900 font-medium">
                    {new Date(row.original.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
                <span className="text-xs text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionCell ticket={row.original} />,
    },
];
