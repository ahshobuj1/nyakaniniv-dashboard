import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { TSupportTicket, TicketStatus } from '@/features/support-tickets/supportTicketsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateTicketStatusMutation } from '@/features/support-tickets/supportTicketsApi';
import { toast } from 'sonner';
import { Mail, Calendar, User as UserIcon, FileText } from 'lucide-react';

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    open: { label: 'Open', variant: 'secondary' },
    in_progress: { label: 'In Progress', variant: 'outline' },
    resolved: { label: 'Resolved', variant: 'default' },
    closed: { label: 'Closed', variant: 'destructive' },
};

function StatusCell({ ticket }: { ticket: TSupportTicket }) {
    const [updateStatus, { isLoading }] = useUpdateTicketStatusMutation();

    const handleChange = async (value: string) => {
        try {
            await updateStatus({ id: ticket.id, status: value as TicketStatus }).unwrap();
            toast.success(`Ticket status updated to "${value}"`);
        } catch {
            toast.error('Failed to update ticket status');
        }
    };

    const cfg = statusConfig[ticket.status] ?? statusConfig.open;

    return (
        <Select value={ticket.status} onValueChange={handleChange} disabled={isLoading}>
            <SelectTrigger className="w-[130px] h-8 text-xs" id={`ticket-status-${ticket.id}`}>
                <SelectValue>
                    <Badge variant={cfg.variant} className="text-xs capitalize">
                        {cfg.label}
                    </Badge>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Object.entries(statusConfig).map(([val, { label, variant }]) => (
                    <SelectItem key={val} value={val}>
                        <Badge variant={variant} className="text-xs capitalize">
                            {label}
                        </Badge>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function TicketDetailsModal({
    ticket,
    open,
    onOpenChange,
}: {
    ticket: TSupportTicket;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [updateStatus, { isLoading }] = useUpdateTicketStatusMutation();
    const cfg = statusConfig[ticket.status] ?? statusConfig.open;

    const handleStatusChange = async (value: string) => {
        try {
            await updateStatus({ id: ticket.id, status: value as TicketStatus }).unwrap();
            toast.success(`Ticket status updated to "${value}"`);
        } catch {
            toast.error('Failed to update ticket status');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl w-full p-6">
                <DialogHeader className="space-y-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-4">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Support Ticket Details
                        </DialogTitle>
                        <Badge variant={cfg.variant} className="capitalize text-xs font-semibold px-2.5 py-0.5">
                            {cfg.label}
                        </Badge>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Ticket ID: <span className="font-mono">{ticket.id}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* User & Meta info Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-sm">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                Submitted By
                            </span>
                            <p className="font-semibold text-gray-900">{ticket.fullName}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {ticket.email}
                            </p>
                        </div>

                        <div className="space-y-1 sm:border-l sm:pl-4 sm:border-gray-200">
                            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                Submission Date
                            </span>
                            <p className="font-semibold text-gray-900">
                                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(ticket.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Subject
                        </label>
                        <p className="text-base font-bold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                            {ticket.subject}
                        </p>
                    </div>

                    {/* Issue Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Full Issue Description
                        </label>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                            {ticket.issue}
                        </div>
                    </div>

                    {/* Actions bar inside modal */}
                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Status:</span>
                            <Select value={ticket.status} onValueChange={handleStatusChange} disabled={isLoading}>
                                <SelectTrigger className="w-[140px] h-9 text-xs bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(statusConfig).map(([val, { label, variant }]) => (
                                        <SelectItem key={val} value={val}>
                                            <Badge variant={variant} className="text-xs capitalize">
                                                {label}
                                            </Badge>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="text-xs gap-1.5 bg-primary text-white hover:bg-primary/90 font-medium"
                            >
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ticket.email)}&su=${encodeURIComponent(`Re: ${ticket.subject} [Ticket #${ticket.id.slice(0, 8)}]`)}&authuser=hello@upbeat.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    Reply via Gmail
                                </a>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ExpandCell({ ticket }: { ticket: TSupportTicket }) {
    const [open, setOpen] = useState(false);

    // Limit preview text to around 15 words
    const words = ticket.issue ? ticket.issue.split(' ') : [];
    const isLong = words.length > 12 || ticket.issue.length > 80;
    const previewText = isLong ? words.slice(0, 12).join(' ') + '...' : ticket.issue;

    return (
        <div className="max-w-[320px] space-y-1">
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {ticket.subject}
                </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
                {previewText}
            </p>
            <button
                onClick={() => setOpen(true)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5"
            >
                See Full Issue →
            </button>

            <TicketDetailsModal
                ticket={ticket}
                open={open}
                onOpenChange={setOpen}
            />
        </div>
    );
}

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
        cell: ({ row }) => (
            <div className="flex flex-col min-w-[150px]">
                <span className="font-medium text-sm text-gray-900">{row.original.fullName}</span>
                <span className="text-xs text-muted-foreground">{row.original.email}</span>
            </div>
        ),
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
];
