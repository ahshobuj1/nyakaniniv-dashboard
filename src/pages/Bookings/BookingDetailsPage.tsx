import { useParams, useNavigate } from 'react-router';
import { useGetBookingByIdQuery } from '@/features/bookings/bookingsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  MessageSquare,
  Star,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  History,
  CreditCard,
  Download,
  Receipt,
  FileCheck,
} from 'lucide-react';
import defaultAvatar from '@/assets/default-image.jpg';
import { formatDate } from '@/utils/formatDate';
import type { Booking, BookingQuote, BookingMessage, BookingAuditEvent } from './type';

function getStatusBadge(status?: string | null) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return <Badge className="bg-emerald-600 text-white capitalize">{s.toLowerCase()}</Badge>;
    case 'PENDING':
    case 'AWAITING_PAYMENT':
      return <Badge variant="secondary" className="capitalize">{s.toLowerCase().replace('_', ' ')}</Badge>;
    case 'CANCELLED':
    case 'REJECTED':
      return <Badge variant="destructive" className="capitalize">{s.toLowerCase()}</Badge>;
    default:
      return <Badge variant="outline" className="capitalize">{s.toLowerCase()}</Badge>;
  }
}

function getPaymentBadge(status?: string | null) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'PAID':
    case 'COMPLETED':
      return <Badge className="bg-emerald-600 text-white capitalize">{s.toLowerCase()}</Badge>;
    case 'PENDING':
      return <Badge variant="secondary" className="capitalize">{s.toLowerCase()}</Badge>;
    case 'FAILED':
      return <Badge variant="destructive" className="capitalize">{s.toLowerCase()}</Badge>;
    default:
      return <Badge variant="outline" className="capitalize">{s.toLowerCase()}</Badge>;
  }
}

function getQuoteStatusBadge(status?: string | null) {
  const s = (status || 'PROPOSED').toUpperCase();
  switch (s) {
    case 'ACCEPTED':
      return <Badge className="bg-emerald-600 text-white capitalize text-[10px]">{s.toLowerCase()}</Badge>;
    case 'PROPOSED':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 capitalize text-[10px]">Active Proposal</Badge>;
    case 'SUPERSEDED':
      return <Badge variant="secondary" className="text-muted-foreground capitalize text-[10px]">{s.toLowerCase()}</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive" className="capitalize text-[10px]">{s.toLowerCase()}</Badge>;
    default:
      return <Badge variant="outline" className="capitalize text-[10px]">{s.toLowerCase()}</Badge>;
  }
}

export default function BookingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useGetBookingByIdQuery(id || '', {
    skip: !id,
  });

  const booking: Booking | undefined = response?.data;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested booking record could not be loaded or does not exist.
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard/bookings')}>
          Back to All Bookings
        </Button>
      </div>
    );
  }

  const orderRef = booking.orderReference || booking.id.slice(0, 8).toUpperCase();
  const eventNotes =
    typeof booking.eventDetails === 'object' && booking.eventDetails !== null
      ? (booking.eventDetails as Record<string, unknown>).notes
      : null;

  const eventDetailsMap =
    typeof booking.eventDetails === 'object' && booking.eventDetails !== null
      ? (booking.eventDetails as Record<string, unknown>)
      : null;

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';
  const invoicePdfUrl = booking.invoice?.id ? `${apiBase}/invoices/v1/${booking.invoice.id}/pdf` : null;

  return (
    <div className="p-2 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/bookings')}
          className="w-fit text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Bookings
        </Button>

        <div className="flex items-center gap-2">
          {getStatusBadge(booking.status)}
          {getPaymentBadge(booking.paymentStatus)}
          {booking.directPaymentStatus && booking.directPaymentStatus !== 'UNREPORTED' && (
            <Badge variant="outline" className="capitalize text-xs">
              Direct: {booking.directPaymentStatus.replace(/_/g, ' ').toLowerCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Booking #{orderRef}</h1>
            <Badge variant="outline" className="font-mono text-xs">
              ID: {booking.id}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Created on {formatDate(booking.createdAt)} • Last updated on {formatDate(booking.updatedAt)}
          </p>
          {booking.confirmedAt && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed on {formatDate(booking.confirmedAt)}
            </p>
          )}
          {booking.completedAt && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed on {formatDate(booking.completedAt)}
            </p>
          )}
        </div>

        <div className="flex flex-col md:items-end">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Total Agreed / Current Rate
          </span>
          <span className="text-3xl font-extrabold text-foreground font-mono">
            {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-muted-foreground">
              Payout: <span className="font-medium capitalize">{booking.payoutStatus.toLowerCase().replace(/_/g, ' ')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Parties & Event Info (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 text-primary" /> Client Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-foreground text-base">
                {booking.client?.name || 'Guest Client'}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Client ID: {booking.client?.id || '—'}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{booking.client?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{booking.client?.phone || 'No phone provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DJ / Tenant Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" /> DJ / Tenant Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <img
                src={booking.tenant?.logoUrl || booking.tenant?.user?.profileImg || defaultAvatar}
                alt={booking.tenant?.stageName || 'DJ'}
                className="h-10 w-10 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              <div>
                <p className="font-bold text-foreground text-base">
                  {booking.tenant?.stageName || 'DJ Profile'}
                </p>
                {booking.tenant?.subdomain ? (
                  <a
                    href={`https://${booking.tenant.subdomain}.deejay.africa`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-mono inline-flex items-center gap-1">
                    <span>{booking.tenant.subdomain}.deejay.africa</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </div>
            <Separator />
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">User Email:</span>{' '}
                {booking.tenant?.user?.email || '—'}
              </p>
              {booking.tenant?.country ? (
                <p>
                  <span className="font-medium text-foreground">Location:</span>{' '}
                  {booking.tenant.city ? `${booking.tenant.city}, ` : ''}
                  {booking.tenant.country}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Event Logistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" /> Event Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-foreground text-base capitalize">
                {booking.eventType || 'Event'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {booking.eventDate ? formatDate(booking.eventDate) : 'Date TBD'}{' '}
                  {booking.eventTimezone ? `(${booking.eventTimezone})` : ''}
                </span>
              </div>
            </div>
            <Separator />
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{booking.address || 'Address not specified'}</span>
              </div>
              {Boolean(eventNotes) && (
                <div className="mt-2 pt-2 border-t text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Client Notes:</span>{' '}
                  {String(eventNotes)}
                </div>
              )}
              {Boolean(eventDetailsMap && Object.keys(eventDetailsMap).length > 1) && (
                <div className="pt-1 text-[11px] space-y-0.5">
                  {Boolean(eventDetailsMap?.guestCount) && (
                    <p><span className="font-medium text-foreground">Guests:</span> {String(eventDetailsMap?.guestCount)}</p>
                  )}
                  {Boolean(eventDetailsMap?.musicGenre) && (
                    <p><span className="font-medium text-foreground">Genre:</span> {String(eventDetailsMap?.musicGenre)}</p>
                  )}
                  {Boolean(eventDetailsMap?.durationHours) && (
                    <p><span className="font-medium text-foreground">Duration:</span> {String(eventDetailsMap?.durationHours)} hrs</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Payment Reporting Card (if applicable) */}
      {(booking.directPaymentStatus !== 'UNREPORTED' || booking.directPaymentMethod || booking.directPaymentProofUrl) && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Direct Payment Settlement Details</span>
              </div>
              <Badge className="capitalize">
                {(booking.directPaymentStatus || 'REPORTED').replace(/_/g, ' ').toLowerCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-muted-foreground">Payment Method:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {booking.directPaymentMethod || 'Offline Transfer / Cash'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Confirmation Status:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {booking.completionConfirmedAt ? (
                    <span className="text-emerald-600 font-medium">Confirmed by DJ</span>
                  ) : booking.completionRequestedAt ? (
                    <span className="text-amber-600 font-medium">Verification Requested</span>
                  ) : (
                    'Pending DJ Confirmation'
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Proof of Payment:</span>
                <p className="mt-0.5">
                  {booking.directPaymentProofUrl ? (
                    <a
                      href={booking.directPaymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
                      <span>View Uploaded Proof</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No file attached</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quotation Negotiation History & Agreement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Quotation Proposals & Negotiation Evolution ({booking.quotes?.length || 0})</span>
            </div>
            {booking.agreement && (
              <Badge className="bg-emerald-600 text-white flex items-center gap-1 text-xs">
                <FileCheck className="h-3.5 w-3.5" />
                Agreement Locked
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.agreement && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-foreground">
                    Confirmed Agreement Snapshot Locked
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Rate locked on {formatDate(booking.agreement.snapshotAt || booking.agreement.createdAt)}
                  {booking.agreement.termsVersion && ` • Terms ${booking.agreement.termsVersion}`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground uppercase font-medium">Agreed Rate</span>
                <p className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {booking.agreement.agreedCurrency || booking.agreement.currencyCode || booking.currencyCode || 'KES'} {Number(booking.agreement.agreedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Quotations History Table */}
          {booking.quotes && booking.quotes.length > 0 ? (
            <div className="space-y-2">
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Proposed By</th>
                      <th className="py-2.5 px-3">Amount & Currency</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Notes / Negotiation Terms</th>
                      <th className="py-2.5 px-3 text-right">Proposed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {booking.quotes.map((q: BookingQuote) => {
                      const proposedBy = (q.proposedBy || q.proposedByRole || 'DJ').toUpperCase();
                      const isDj = proposedBy === 'DJ';
                      const quoteCurrency = q.currency || q.currencyCode || booking.currencyCode || 'KES';
                      const isAccepted = q.status?.toUpperCase() === 'ACCEPTED';

                      return (
                        <tr
                          key={q.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isAccepted ? 'bg-emerald-500/5 font-medium' : ''
                          }`}>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            v{q.version}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                isDj
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              }`}>
                              {isDj ? 'DJ Proposal' : 'Client Proposal'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                            {quoteCurrency} {Number(q.amount).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            {getQuoteStatusBadge(q.status)}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground max-w-sm">
                            {q.notes || <span className="italic text-muted-foreground/60">No additional notes</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right text-muted-foreground font-mono">
                            {formatDate(q.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-muted/30 border text-xs text-muted-foreground text-center">
              No formal quotations logged yet for this booking.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Communication Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Communication & Negotiation Messages ({booking.messages?.length || 0})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {booking.messages && booking.messages.length > 0 ? (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {booking.messages.map((m: BookingMessage) => {
                const senderRole = (m.senderType || m.senderRole || 'DJ').toUpperCase();
                const isDj = senderRole === 'DJ';
                const messageText = m.content || m.message || '';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col p-3.5 rounded-xl border text-xs gap-1.5 transition-colors ${
                      isDj
                        ? 'bg-primary/5 border-primary/20 ml-6 sm:ml-12'
                        : 'bg-muted/40 border-border mr-6 sm:mr-12'
                    }`}>
                    <div className="flex items-center justify-between text-[11px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            isDj ? 'text-primary' : 'text-foreground'
                          }`}>
                          {isDj
                            ? `${booking.tenant?.stageName || 'DJ'} (DJ)`
                            : `${booking.client?.name || 'Client'} (Client)`}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-[10px] font-mono">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {messageText}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground border rounded-xl bg-muted/20">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No chat or negotiation messages exchanged between DJ and client yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Trail & Event Timeline */}
      {booking.auditEvents && booking.auditEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <span>Audit Trail & Activity Log ({booking.auditEvents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-4 border-l-2 border-border/60 ml-2">
              {booking.auditEvents.map((event: BookingAuditEvent) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary/20 border-2 border-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-foreground font-mono">
                      {event.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Triggered by <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{event.actorType.toLowerCase()}</Badge>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice & Payment Information (if attached) */}
      {booking.invoice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <span>Invoice #{booking.invoice.invoiceNumber || booking.invoice.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {invoicePdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 gap-1.5 text-xs text-primary hover:bg-primary/5">
                  <a
                    href={invoicePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`invoice-${booking.invoice.id}.pdf`}>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </a>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-mono font-bold text-foreground text-sm mt-0.5">
                  {booking.invoice.currency || booking.currencyCode || 'KES'} {Number(booking.invoice.amount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Invoice Status:</span>
                <p className="mt-0.5">{getStatusBadge(booking.invoice.status)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gateway / Method:</span>
                <p className="font-semibold text-foreground mt-0.5 capitalize">
                  {booking.invoice.gateway || '—'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Issued At:</span>
                <p className="text-muted-foreground font-mono mt-0.5">
                  {formatDate(booking.invoice.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Section (if client reviewed) */}
      {booking.review && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Client Review & Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < booking.review!.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
              <span className="font-bold text-foreground ml-1.5">{booking.review.rating} / 5</span>
            </div>
            {booking.review.reviewText && (
              <p className="text-foreground italic bg-muted/30 p-3 rounded-lg border">
                "{booking.review.reviewText}"
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Submitted by {booking.review.clientName || 'Client'} on {formatDate(booking.review.createdAt)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
