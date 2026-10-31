import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import type {TTransaction} from './type';

interface TransactionDetailsModalProps {
  transaction: TTransaction | null;
  open: boolean;
  onClose: () => void;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start py-1.5 gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right break-all">{value}</span>
    </div>
  );
}

const statusVariantMap: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  paid: 'default',
  pending: 'secondary',
  failed: 'destructive',
  cancelled: 'destructive',
};

export function TransactionDetailsModal({
  transaction,
  open,
  onClose,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const isSubscription = transaction.type === 'SUBSCRIPTION';
  const status = transaction.status?.toLowerCase() ?? 'pending';
  const statusVariant = statusVariantMap[status] ?? 'outline';

  const customerName = isSubscription
    ? `${transaction.user?.firstName ?? ''} ${transaction.user?.lastName ?? ''}`.trim()
    : transaction.booking?.client?.name;

  const customerEmail = isSubscription
    ? transaction.user?.email
    : transaction.booking?.client?.email;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" id="transaction-details-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaction Details
            <Badge variant={statusVariant} className="capitalize text-xs ml-1">
              {transaction.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Meta */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Transaction Info
            </p>
            <div className="space-y-0.5">
              <InfoRow label="Transaction ID" value={transaction.id} />
              <InfoRow
                label="Amount"
                value={`${transaction.currency || 'KES'} ${transaction.amount}`}
              />
              <InfoRow
                label="Payment Method"
                value={`${transaction.channel || 'UNKNOWN'} (${transaction.gateway || 'UNKNOWN'})`.replace(
                  /_/g,
                  ' ',
                )}
              />
              <InfoRow
                label="Type"
                value={
                  isSubscription
                    ? 'Subscription Payment'
                    : 'Event Booking Payment'
                }
              />
              <InfoRow
                label="Date"
                value={new Date(transaction.createdAt).toLocaleString()}
              />
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {isSubscription ? 'DJ / Subscriber' : 'Client'}
            </p>
            <div className="space-y-0.5">
              <InfoRow label="Name" value={customerName || 'N/A'} />
              <InfoRow label="Email" value={customerEmail || 'N/A'} />
            </div>
          </div>

          <Separator />

          {/* Plan or DJ Info */}
          {isSubscription && transaction.plan && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Subscription Plan
              </p>
              <div className="space-y-0.5">
                <InfoRow label="Plan Name" value={transaction.plan.name} />
              </div>
            </div>
          )}

          {!isSubscription && transaction.tenant && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Tenant
              </p>
              <div className="space-y-0.5">
                <InfoRow
                  label="Stage Name"
                  value={transaction.tenant.stageName}
                />
                <InfoRow
                  label="Profile URL"
                  value={`https://${transaction.tenant.subdomain}.deejay.africa`}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
