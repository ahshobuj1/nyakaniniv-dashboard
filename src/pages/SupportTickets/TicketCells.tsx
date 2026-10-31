import { useState } from 'react';
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
import {
    Mail,
    Calendar,
    User as UserIcon,
    FileText,
    Zap,
    ExternalLink,
    Disc,
    Eye,
} from 'lucide-react';
import { PlanBadge } from '@/components/common/PlanBadge';

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    open: { label: 'Open', variant: 'secondary' },
    in_progress: { label: 'In Progress', variant: 'outline' },
    resolved: { label: 'Resolved', variant: 'default' },
    closed: { label: 'Closed', variant: 'destructive' },
};

export function StatusCell({ ticket }: { ticket: TSupportTicket }) {
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
            <SelectTrigger className="w-[125px] h-8 text-xs" id={`ticket-status-${ticket.id}`}>
                <SelectValue>
                    <Badge variant={cfg.variant} className="text-xs capitalize font-medium">
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

export function TicketDetailsModal({
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

    const planName = ticket.planName || ticket.user?.subscriptions?.[0]?.plan?.name || null;
    const isPriority =
        ticket.hasPrioritySupport ||
        ticket.priority === 'priority' ||
        planName?.toLowerCase() === 'elite';

    const stageName = ticket.tenant?.stageName || ticket.user?.tenant?.stageName;
    const subdomain = ticket.tenant?.subdomain || ticket.user?.tenant?.subdomain;

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

                <div className="space-y-4 pt-2">
                    {/* Priority Alert Banner if Priority Support */}
                    {isPriority ? (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/40 dark:border-amber-700/60 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                                <div>
                                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                                        Priority Support Active (VIP Queue)
                                    </span>
                                    <span className="text-[11px] text-amber-700 dark:text-amber-300">
                                        Client has an active {planName || 'Elite'} tier subscription with priority SLA response.
                                    </span>
                                </div>
                            </div>
                            <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-600 text-white">
                                Priority
                            </span>
                        </div>
                    ) : (
                        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Support Tier:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                Standard Support Queue
                            </span>
                        </div>
                    )}

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
                            {stageName && (
                                <p className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                                    <Disc className="w-3 h-3 text-primary" />
                                    DJ Stage Name: {stageName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:border-l sm:pl-4 sm:border-gray-200">
                            <div>
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    Submission Date
                                </span>
                                <p className="font-semibold text-gray-900 text-xs mt-0.5">
                                    {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}{' '}
                                    at {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-medium text-gray-500 block mb-1">
                                    Subscription Plan
                                </span>
                                <PlanBadge name={planName} />
                            </div>

                            {subdomain && (
                                <div>
                                    <a
                                        href={`https://${subdomain}.deejay.africa`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                        Visit DJ Website
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Subject
                        </label>
                        <p className="text-sm font-bold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                            {ticket.subject}
                        </p>
                    </div>

                    {/* Issue Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Full Issue Description
                        </label>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-800 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
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

export function ExpandCell({ ticket }: { ticket: TSupportTicket }) {
    const [open, setOpen] = useState(false);

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
                type="button"
                onClick={() => setOpen(true)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
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

export function ActionCell({ ticket }: { ticket: TSupportTicket }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-1.5">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="h-8 text-xs gap-1 font-medium hover:bg-primary/5 hover:text-primary"
            >
                <Eye className="w-3.5 h-3.5" />
                Details
            </Button>

            <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1 font-medium text-gray-600 hover:text-primary"
                title="Reply via Gmail"
            >
                <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ticket.email)}&su=${encodeURIComponent(`Re: ${ticket.subject} [Ticket #${ticket.id.slice(0, 8)}]`)}&authuser=hello@upbeat.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Mail className="w-3.5 h-3.5" />
                </a>
            </Button>

            <TicketDetailsModal
                ticket={ticket}
                open={open}
                onOpenChange={setOpen}
            />
        </div>
    );
}

