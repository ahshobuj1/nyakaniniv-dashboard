/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Coins, Loader2 } from 'lucide-react';
import { useGetCurrenciesQuery, useToggleCurrencyMutation } from '@/features/plans/plansApi';
import { toast } from 'sonner';

interface Props {
  trigger?: React.ReactNode;
}

export default function CurrenciesModal({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { data: response, isLoading } = useGetCurrenciesQuery();
  const [toggleCurrency, { isLoading: isToggling }] = useToggleCurrencyMutation();
  const [togglingCode, setTogglingCode] = useState<string | null>(null);

  const currencies: Array<{
    id?: number;
    code: string;
    name: string;
    symbol: string;
    isActive: boolean;
  }> = response?.data || [];

  const handleToggle = async (code: string, currentStatus: boolean) => {
    try {
      setTogglingCode(code);
      await toggleCurrency({ code, isActive: !currentStatus }).unwrap();
      toast.success(`Currency ${code} is now ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to update currency ${code}`);
    } finally {
      setTogglingCode(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Coins className="h-4 w-4" /> Manage Currencies
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" /> Supported Currencies
          </DialogTitle>
          <DialogDescription>
            Enable or disable currencies for subscription pricing. Only active currencies are displayed to DJs and public visitors.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading currencies...
            </div>
          ) : currencies.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              No currencies found in database.
            </p>
          ) : (
            <div className="border rounded-md divide-y">
              {currencies.map((currency) => {
                const isWorking = isToggling && togglingCode === currency.code;
                return (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {currency.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{currency.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            ({currency.symbol || currency.code})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {currency.code === 'USD'
                            ? 'Global USD • Routed via Paystack'
                            : currency.code === 'KES'
                              ? 'Kenya • Routed via Pesapal'
                              : 'African Currency • Routed via Flutterwave'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={currency.isActive ? 'default' : 'secondary'}
                        className={currency.isActive ? 'bg-emerald-600 text-white' : 'text-gray-400'}
                      >
                        {currency.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={currency.isActive}
                        onCheckedChange={() => handleToggle(currency.code, currency.isActive)}
                        disabled={isWorking}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
