import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { CalendarCheck2, ArrowRight, Music } from 'lucide-react';
import type { RecentBooking } from '@/features/analytics/type';

interface RecentBookingsCardProps {
  bookings?: RecentBooking[];
}

export function RecentBookingsCard({ bookings = [] }: RecentBookingsCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 text-xs">Paid & Completed</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20 text-xs">Accepted</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 text-xs">Pending</Badge>;
      case 'canceled':
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20 text-xs">Canceled</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status || 'Unknown'}</Badge>;
    }
  };

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

          <Button variant="ghost" size="sm" asChild className="text-xs font-semibold gap-1 text-primary hover:text-primary/80">
            <Link to="/dashboard/transactions">
              <span>View Invoices</span>
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
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Assigned DJ</th>
                  <th className="py-3 px-4">Amount (KES)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {bookings.map((booking) => {
                  const djName =
                    booking.tenant?.subdomain ||
                    `${booking.tenant?.user?.firstName || ''} ${booking.tenant?.user?.lastName || ''}`.trim() ||
                    'Unknown DJ';

                  const dateFormatted = new Date(booking.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5">
                        <div className="font-semibold text-foreground">{booking.client?.name || booking.clientName || 'Anonymous'}</div>
                        <div className="text-[11px] text-muted-foreground">{booking.client?.email || booking.clientEmail || 'No email'}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">{booking.eventType || 'Gig / Event'}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Music size={13} className="text-primary shrink-0" />
                          <Link to={`https://${djName}.deejay.africa`} 
                          className="cursor-pointer text-primary hover:text-primary/80 font-semibold" target='_blank'>{djName}</Link>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-foreground">
                        ${Number(booking.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(booking.status)}
                      </td>

                      <td className="py-3 px-5 text-right text-muted-foreground text-[11px]">
                        {dateFormatted}
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
