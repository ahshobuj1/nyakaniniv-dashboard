import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { CalendarCheck2, ArrowRight, Eye, ExternalLink } from 'lucide-react';
import defaultAvatar from '@/assets/default-image.jpg';
import type { RecentBooking } from '@/features/analytics/type';

interface RecentBookingsCardProps {
  bookings?: RecentBooking[];
}

function getStatusBadge(status?: string | null) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'CONFIRMED':
    case 'COMPLETED':
      return (
        <Badge className="bg-emerald-600 text-white capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
    case 'PENDING':
    case 'AWAITING_PAYMENT':
      return (
        <Badge variant="secondary" className="capitalize text-[11px]">
          {s.toLowerCase().replace('_', ' ')}
        </Badge>
      );
    case 'CANCELLED':
    case 'REJECTED':
      return (
        <Badge variant="destructive" className="capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
  }
}

function getPaymentBadge(status?: string | null) {
  const s = (status || 'PENDING').toUpperCase();
  switch (s) {
    case 'PAID':
    case 'COMPLETED':
      return (
        <Badge className="bg-emerald-600 text-white capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="secondary" className="capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className="capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="capitalize text-[11px]">
          {s.toLowerCase()}
        </Badge>
      );
  }
}

export function RecentBookingsCard({ bookings = [] }: RecentBookingsCardProps) {
  return (
    <Card className="border border-border/60 bg-card overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarCheck2 size={18} className="text-amber-500" />
              Latest DJ Bookings Activity
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Live stream of recent event booking requests placed on DJ websites
            </CardDescription>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs font-semibold gap-1 text-primary hover:text-primary/80">
            <Link to="/dashboard/bookings">
              <span>View All Bookings</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <CalendarCheck2 size={32} className="mx-auto mb-2 opacity-40" />
            <p>No bookings placed yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-y border-border/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Event / Type</th>
                  <th className="py-3 px-4">DJ Tenant</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-3">Booking Status</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {bookings.map((booking) => {
                  const ref =
                    booking.orderReference ||
                    booking.id.slice(0, 8).toUpperCase();

                  const clientName =
                    booking.client?.name || booking.clientName || 'Guest Client';
                  const clientEmail =
                    booking.client?.email || booking.clientEmail || 'No email';
                  const clientPhone = booking.client?.phone;

                  const stageName =
                    booking.tenant?.stageName ||
                    `${booking.tenant?.user?.firstName || ''} ${booking.tenant?.user?.lastName || ''}`.trim() ||
                    'DJ Profile';

                  const avatarSrc =
                    booking.tenant?.logoUrl || defaultAvatar;

                  const amount = Number(booking.totalAmount || 0);
                  const currency = booking.currencyCode || 'KES';

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-foreground">
                        {ref}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col py-0.5 gap-0.5">
                          <span className="font-semibold text-sm text-foreground">
                            {clientName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {clientEmail}
                          </span>
                          {clientPhone ? (
                            <span className="text-[11px] text-muted-foreground/80">
                              {clientPhone}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5 max-w-[180px]">
                          <span className="font-medium text-sm text-foreground capitalize truncate">
                            {booking.eventType || 'Event'}
                          </span>
                          {booking.address ? (
                            <span
                              className="text-xs text-muted-foreground truncate"
                              title={booking.address}>
                              {booking.address}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={avatarSrc}
                            alt={stageName}
                            className="h-8 w-8 rounded-full object-cover border shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar;
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-xs leading-none text-foreground">
                              {stageName}
                            </span>
                            {booking.tenant?.subdomain ? (
                              <a
                                href={`https://${booking.tenant.subdomain}.deejay.africa`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-primary hover:underline font-mono inline-flex items-center gap-0.5 mt-0.5">
                                <span>{booking.tenant.subdomain}</span>
                                <ExternalLink size={10} />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-sm font-mono text-foreground whitespace-nowrap">
                        {currency} {amount.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        {getStatusBadge(booking.status)}
                      </td>

                      <td className="py-3 px-3">
                        {getPaymentBadge(booking.paymentStatus)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 gap-1.5 text-xs text-foreground hover:bg-accent">
                          <Link to={`/dashboard/bookings/${booking.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
