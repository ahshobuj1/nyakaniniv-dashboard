import { useParams, useNavigate, Link } from 'react-router';
import { useGetTransactionQuery } from '@/features/transactions/transactionsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { PlanBadge } from '@/components/common/PlanBadge';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    CreditCard,
    User,
    Calendar,
    ExternalLink,
    Download,
    Building2,
    ShieldCheck,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    paid: { label: 'Paid / Completed', variant: 'default', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
    completed: { label: 'Paid / Completed', variant: 'default', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
    pending: { label: 'Pending Payment', variant: 'secondary', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    failed: { label: 'Failed', variant: 'destructive', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
    cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function TransactionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useGetTransactionQuery(id, {
        skip: !id,
    });

    const invoice = response?.data;

    if (isLoading) {
        return (
            <div className="w-full p-2 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64 md:col-span-2" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="w-full p-12 text-center space-y-4">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-bold">Transaction / Invoice Not Found</h2>
                <p className="text-sm text-muted-foreground">
                    The requested transaction or invoice could not be loaded or does not exist.
                </p>
                <Button onClick={() => navigate('/dashboard/transactions')} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Transactions
                </Button>
            </div>
        );
    }

    const isSubscription = invoice.type === 'SUBSCRIPTION';
    const statusKey = (invoice.status || 'pending').toLowerCase();
    const statusInfo = statusConfig[statusKey] ?? statusConfig.pending;

    // Filter to show ONLY the Paid/Successful transaction to prevent showing duplicate/pending attempts
    const paidTransactions = (invoice.transactions || []).filter((tx: Record<string, unknown>) =>
        ['paid', 'completed', 'success'].includes(String(tx.status || '').toLowerCase())
    );
    const displayTransactions = paidTransactions.length > 0
        ? paidTransactions
        : (invoice.transactions || []).slice(0, 1);

    const mainTx = displayTransactions[0] || invoice.transactions?.[0] || invoice.transaction;

    const customerName = isSubscription
        ? `${invoice.user?.firstName ?? ''} ${invoice.user?.lastName ?? ''}`.trim() || 'N/A'
        : invoice.booking?.client?.name || 'N/A';

    const customerEmail = isSubscription
        ? invoice.user?.email || 'N/A'
        : invoice.booking?.client?.email || 'N/A';

    const customerPhone = invoice.booking?.client?.phone;

    // PDF Download URL from backend
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const pdfUrl = `${apiBase}/invoices/v1/${invoice.id}/pdf`;

    return (
        <div className="w-full p-2 space-y-6">
            {/* Top Navigation & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard/transactions')}
                    className="w-fit text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Transactions
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                    >
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-4 h-4 text-primary" />
                            Download Invoice PDF
                        </a>
                    </Button>
                
                </div>
            </div>

            {/* Main Header Card */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Invoice #{invoice.id.slice(0, 8).toUpperCase()}
                        </h1>
                        <Badge variant={statusInfo.variant} className="capitalize text-xs font-semibold px-2.5 py-1">
                            {statusInfo.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {isSubscription ? 'Subscription Invoice' : 'Event Booking Invoice'}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Full ID: <span className="font-mono">{invoice.id}</span>
                    </p>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Total Amount
                    </span>
                    <span className="text-3xl font-extrabold text-primary">
                        {invoice.amount} <span className="text-base font-bold">KES</span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 Columns: Printable Invoice View */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/70 border-b border-gray-200/80 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Official Invoice Statement
                                </CardTitle>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Date: {new Date(invoice.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            {/* Billing Parties */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50/50 border border-gray-200/60 text-sm">
                                {/* Billed To */}
                                <div className="space-y-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        Billed To (Customer)
                                    </span>
                                    <p className="font-bold text-gray-900 text-base">{customerName}</p>
                                    <p className="text-gray-600 text-xs">{customerEmail}</p>
                                    {customerPhone && <p className="text-gray-600 text-xs">Phone: {customerPhone}</p>}
                                </div>

                                {/* Billed By / Service Provider */}
                                <div className="space-y-1.5 sm:border-l sm:pl-6 sm:border-gray-200">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        Payee / Platform
                                    </span>
                                    {isSubscription ? (
                                        <>
                                            <p className="font-bold text-gray-900 text-base">UpBeat Entertainment Africa</p>
                                            <p className="text-gray-600 text-xs">SaaS Subscription & DJ Platform</p>
                                            <p className="text-gray-600 text-xs">support@upbeat.africa</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-bold text-gray-900 text-base">
                                                {invoice.tenant?.stageName || 'DJ Service Provider'}
                                            </p>
                                            {invoice.tenant?.subdomain && (
                                                <Link
                                                    to={`https://${invoice.tenant.subdomain}.deejay.africa`}
                                                    target="_blank"
                                                    className="text-primary hover:underline text-xs flex items-center gap-1 font-medium"
                                                >
                                                    {invoice.tenant.subdomain}.deejay.africa
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                            <p className="text-gray-600 text-xs">
                                                {invoice.tenant?.city ? `${invoice.tenant.city}, ` : ''}{invoice.tenant?.country || ''}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Itemized Breakdown Table */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-600">
                                        <tr>
                                            <th className="py-3 px-4">Item & Description</th>
                                            <th className="py-3 px-4 text-center">Type</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {isSubscription ? (
                                            <tr>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900">
                                                            {invoice.plan?.name || 'Subscription'} Plan
                                                        </p>
                                                        <PlanBadge name={invoice.plan?.name} />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        UpBeat Africa DJ Platform Membership & Tools
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4 text-center text-xs">
                                                    <Badge variant="outline">Subscription</Badge>
                                                </td>
                                                <td className="py-4 px-4 text-right font-semibold text-gray-900">
                                                    {invoice.amount} KES
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td className="py-4 px-4">
                                                    <p className="font-bold text-gray-900">
                                                        {invoice.booking?.eventType || 'DJ Event Performance'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {invoice.booking?.eventDate ? `Date: ${new Date(invoice.booking.eventDate).toLocaleDateString()}` : ''}
                                                        {invoice.booking?.address ? ` | Location: ${invoice.booking.address}` : ''}
                                                    </p>
                                                    {invoice.booking?.eventDetails && (
                                                        <p className="text-xs text-gray-500 mt-1 italic">
                                                            Note: {invoice.booking.eventDetails}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-center text-xs">
                                                    <Badge variant="outline">Event Booking</Badge>
                                                </td>
                                                <td className="py-4 px-4 text-right font-semibold text-gray-900">
                                                    {invoice.amount} KES
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50/60 font-semibold text-gray-900">
                                        <tr>
                                            <td colSpan={2} className="py-3 px-4 text-right text-xs uppercase tracking-wider text-muted-foreground">
                                                Total Due / Paid:
                                            </td>
                                            <td className="py-3 px-4 text-right text-base font-extrabold text-primary">
                                                {invoice.amount} KES
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verified Payment Record */}
                    {displayTransactions && displayTransactions.length > 0 && (
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    Payment Gateway Transaction
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100 text-sm">
                                    {displayTransactions.map((tx: Record<string, unknown>, idx: number) => {
                                        const txStatus = String(tx.status || '').toLowerCase();
                                        const txGateway = String(tx.gateway || tx.channel || 'Paystack / Card');
                                        const txRef = String(tx.reference || tx.gatewayRef || tx.gatewayReference || 'N/A');
                                        const txAmount = Number(tx.amount || invoice.amount || 0);
                                        const txDate = tx.createdAt ? new Date(String(tx.createdAt)).toLocaleString() : '';

                                        return (
                                            <div key={String(tx.id || idx)} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {txGateway} Payment
                                                        </span>
                                                        <Badge variant={statusConfig[txStatus]?.variant || 'default'} className="text-[11px] capitalize">
                                                            {String(tx.status || 'Pending')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        Reference: {txRef}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{txAmount} KES</p>
                                                    {txDate ? (
                                                        <p className="text-xs text-muted-foreground">
                                                            {txDate}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Payment Details & Meta Sidebar */}
                <div className="space-y-6">
                    {/* Payment Information Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4 text-sm">
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={statusInfo.variant} className="capitalize text-xs">
                                        {statusInfo.label}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Gateway / Method</span>
                                    <span className="font-semibold text-gray-900">
                                        {mainTx?.gateway || invoice.method?.replace('_', ' ') || 'Paystack / Card'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Currency</span>
                                    <span className="font-semibold text-gray-900">KES (Kenyan Shilling)</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Created At</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(invoice.createdAt).toLocaleDateString()} {new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {invoice.updatedAt && (
                                    <>
                                        <Separator />
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Last Updated</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(invoice.updatedAt).toLocaleDateString()} {new Date(invoice.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Associated Booking or User Account */}
                    {!isSubscription && invoice.booking && (
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-3 border-b border-gray-100">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Linked Booking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3 text-sm">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Event Type</span>
                                    <p className="font-semibold text-gray-900">{invoice.booking.eventType || 'Event'}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Booking Status</span>
                                    <Badge variant="outline" className="capitalize text-xs mt-1">
                                        {invoice.booking.status}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Client Contact</span>
                                    <p className="text-xs font-medium text-gray-800 mt-0.5">{invoice.booking.client?.name}</p>
                                    <p className="text-xs text-muted-foreground">{invoice.booking.client?.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
