import {useParams, useNavigate} from 'react-router';
import {useGetBookingByIdQuery} from '@/features/bookings/bookingsApi';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Separator} from '@/components/ui/separator';
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
} from 'lucide-react';
import defaultAvatar from '@/assets/default-image.jpg';
import {formatDate} from '@/utils/formatDate';
import type {Booking} from './type';

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

export default function BookingDetailsPage() {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const {data: response, isLoading, isError} = useGetBookingByIdQuery(id || '', {
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
        </div>

        <div className="flex flex-col md:items-end">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Total Agreed Amount
          </span>
          <span className="text-3xl font-extrabold text-foreground font-mono">
            {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
          </span>
          {booking.directPaymentStatus ? (
            <span className="text-[11px] text-muted-foreground mt-0.5 capitalize">
              Direct Payment: {booking.directPaymentStatus.replace(/_/g, ' ').toLowerCase()}
            </span>
          ) : null}
        </div>
      </div>

      {/* Grid: Parties & Event Info */}
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
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{booking.address || 'Address not specified'}</span>
              </div>
              {eventNotes ? (
                <div className="mt-2 pt-2 border-t text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Notes:</span>{' '}
                  {String(eventNotes)}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agreement & Quotation Audit Trail (Proof) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Booking Agreement & Quotation Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.agreement ? (
            <div className="p-4 rounded-xl bg-muted/50 border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-foreground">
                    Confirmed Agreement Snapshot Locked
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Snapshot taken on {formatDate(booking.agreement.snapshotAt || booking.agreement.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground uppercase font-medium">Agreed Rate</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {booking.agreement.currencyCode || 'KES'} {Number(booking.agreement.agreedAmount).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-muted/30 border text-xs text-muted-foreground text-center">
              No locked agreement snapshot recorded yet. Quotation negotiation may still be in progress.
            </div>
          )}

          {/* Quotations History Table */}
          {booking.quotes && booking.quotes.length > 0 ? (
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quotation Proposals & Negotiation History ({booking.quotes.length})
              </h4>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Ver</th>
                      <th className="py-2.5 px-3">Proposed By</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Notes / Message</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {booking.quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-muted/30">
                        <td className="py-2 px-3 font-mono font-semibold">v{q.version}</td>
                        <td className="py-2 px-3 font-medium capitalize">
                          {q.proposedByRole?.toLowerCase() || 'DJ'}
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-foreground">
                          {q.currencyCode || 'KES'} {Number(q.amount).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground max-w-xs truncate">
                          {q.notes || '—'}
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {q.status?.toLowerCase() || 'pending'}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-right text-muted-foreground font-mono">
                          {formatDate(q.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Communication & Messages Audit Log (Complete proof) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Message Communication Thread ({booking.messages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {booking.messages && booking.messages.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {booking.messages.map((m) => {
                const isDj = m.senderRole === 'DJ';
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      isDj ? 'bg-primary/5 border-primary/20 ml-6' : 'bg-muted/40 mr-6'
                    }`}>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                      <span className={`font-semibold ${isDj ? 'text-primary' : 'text-foreground'}`}>
                        {isDj ? `DJ (${booking.tenant?.stageName || 'DJ'})` : `Client (${booking.client?.name || 'Client'})`}
                      </span>
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">
              No message logs recorded between DJ and client for this booking.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Review Section (if client reviewed) */}
      {booking.review ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Client Review & Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({length: 5}).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < booking.review!.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
              <span className="font-bold text-foreground ml-1.5">{booking.review.rating} / 5</span>
            </div>
            {booking.review.reviewText ? (
              <p className="text-foreground italic bg-muted/30 p-3 rounded-lg border">
                "{booking.review.reviewText}"
              </p>
            ) : null}
            <p className="text-[11px] text-muted-foreground">
              Submitted by {booking.review.clientName || 'Client'} on {formatDate(booking.review.createdAt)}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
