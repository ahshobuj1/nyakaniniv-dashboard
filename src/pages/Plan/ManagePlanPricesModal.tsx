/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState, useMemo, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Loader2, DollarSign, Check} from 'lucide-react';
import {
  useGetCurrenciesQuery,
  useGetPlanPricesQuery,
  useSetPlanPriceMutation,
} from '@/features/plans/plansApi';
import {toast} from 'sonner';
import type {IPlan} from './type';

interface Props {
  plan: IPlan;
  trigger: React.ReactNode;
}

export default function ManagePlanPricesModal({plan, trigger}: Props) {
  const [open, setOpen] = useState(false);

  const {data: currenciesRes, isLoading: isLoadingCurrencies} =
    useGetCurrenciesQuery();
  const {data: pricesRes, isLoading: isLoadingPrices} = useGetPlanPricesQuery(
    plan.id,
    {
      skip: !open,
    },
  );
  const [setPlanPrice, {isLoading: isSaving}] = useSetPlanPriceMutation();

  const [savingCurrency, setSavingCurrency] = useState<string | null>(null);
  const [formPrices, setFormPrices] = useState<
    Record<string, {monthly: string; discount: string}>
  >({});

  const currencies: Array<{
    code: string;
    name: string;
    symbol: string;
    isActive: boolean;
  }> = currenciesRes?.data || [];

  const existingPrices = useMemo<
    Array<{
      currencyCode: string;
      priceMonthly: string | number;
      priceAnnually: string | number;
      isActive: boolean;
    }>
  >(() => pricesRes?.data || [], [pricesRes?.data]);

  // Initialize form prices when existingPrices load or dialog opens
  useEffect(() => {
    if (open && existingPrices.length > 0) {
      const init: Record<string, {monthly: string; discount: string}> = {};
      existingPrices.forEach((p) => {
        const m = Number(p.priceMonthly);
        const a = Number(p.priceAnnually);
        let disc = String(plan.discountPercentage || 0);
        if (m > 0 && a > 0) {
          const calculatedDisc = Math.round((1 - a / (m * 12)) * 100);
          if (calculatedDisc >= 0 && calculatedDisc <= 100) {
            disc = String(calculatedDisc);
          }
        }
        init[p.currencyCode] = {
          monthly: String(p.priceMonthly),
          discount: disc,
        };
      });
      setFormPrices((prev) => ({...init, ...prev}));
    }
  }, [open, existingPrices, plan.discountPercentage]);

  const handlePriceChange = (
    currencyCode: string,
    field: 'monthly' | 'discount',
    value: string,
  ) => {
    setFormPrices((prev) => ({
      ...prev,
      [currencyCode]: {
        monthly: prev[currencyCode]?.monthly ?? '',
        discount:
          prev[currencyCode]?.discount ?? String(plan.discountPercentage || 0),
        [field]: value,
      },
    }));
  };

  const getCalculatedAnnual = (monthlyStr: string, discountStr: string) => {
    const monthly = Number(monthlyStr);
    const discount = Number(discountStr) || 0;
    if (isNaN(monthly) || monthly <= 0) return 0;
    return Math.max(0, Math.round(monthly * 12 * (1 - discount / 100)));
  };

  const handleSavePrice = async (currencyCode: string) => {
    const monthlyStr = formPrices[currencyCode]?.monthly;
    const discountStr =
      formPrices[currencyCode]?.discount ??
      String(plan.discountPercentage || 0);

    const priceMonthly = Number(monthlyStr);
    const discountPercent = Number(discountStr);

    if (isNaN(priceMonthly) || priceMonthly < 0) {
      toast.error(`Please enter a valid monthly price for ${currencyCode}`);
      return;
    }
    if (
      isNaN(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      toast.error(
        `Please enter a valid discount percentage (0-100) for ${currencyCode}`,
      );
      return;
    }

    const priceAnnually = getCalculatedAnnual(monthlyStr || '0', discountStr);

    try {
      setSavingCurrency(currencyCode);
      await setPlanPrice({
        planId: plan.id,
        currencyCode,
        priceMonthly,
        priceAnnually,
        isActive: true,
      }).unwrap();
      toast.success(`Price for ${currencyCode} updated successfully!`);
    } catch (error: any) {
      toast.error(
        error?.data?.message || `Failed to update price for ${currencyCode}`,
      );
    } finally {
      setSavingCurrency(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Country Prices:{' '}
            {plan.name}
          </DialogTitle>
          <DialogDescription>
            Enter the monthly price for each currency. The annual price will be
            automatically calculated based on the discount percentage.
          </DialogDescription>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">
              Default Plan Discount:
            </span>
            <Badge
              variant="secondary"
              className="text-xs text-primary font-medium">
              {plan.discountPercentage || 0}%
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoadingCurrencies || isLoadingPrices ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading
              prices...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border rounded-md divide-y">
                {currencies
                  .filter((c) => c.isActive)
                  .map((curr) => {
                    const existing = existingPrices.find(
                      (p) => p.currencyCode === curr.code,
                    );
                    const currentMonthly =
                      formPrices[curr.code]?.monthly ??
                      (existing ? String(existing.priceMonthly) : '');

                    let defaultDisc = String(plan.discountPercentage || 0);
                    if (existing) {
                      const m = Number(existing.priceMonthly);
                      const a = Number(existing.priceAnnually);
                      if (m > 0 && a > 0) {
                        const calculatedDisc = Math.round(
                          (1 - a / (m * 12)) * 100,
                        );
                        if (calculatedDisc >= 0 && calculatedDisc <= 100) {
                          defaultDisc = String(calculatedDisc);
                        }
                      }
                    }

                    const currentDiscount =
                      formPrices[curr.code]?.discount ?? defaultDisc;

                    const calculatedAnnual = getCalculatedAnnual(
                      currentMonthly,
                      currentDiscount,
                    );
                    const isSavingCurr =
                      isSaving && savingCurrency === curr.code;

                    return (
                      <div
                        key={curr.code}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="min-w-[130px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">
                              {curr.code}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {curr.symbol || curr.code}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {curr.name}
                          </p>
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="grid grid-cols-2 gap-3 w-full">
                            <div>
                              <label className="text-[11px] text-muted-foreground font-medium block mb-1">
                                Monthly Price
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0.00"
                                value={currentMonthly}
                                onChange={(e) =>
                                  handlePriceChange(
                                    curr.code,
                                    'monthly',
                                    e.target.value,
                                  )
                                }
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] text-muted-foreground font-medium">
                                  Discount (%)
                                </label>
                                {Number(currentDiscount) > 0 && (
                                  <span className="text-[10px] text-emerald-600 font-semibold">
                                    {/* {currentDiscount}% off */}
                                  </span>
                                )}
                              </div>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder={String(
                                    plan.discountPercentage || 0,
                                  )}
                                  value={currentDiscount}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      curr.code,
                                      'discount',
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-xs font-mono pr-7"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Auto Calculated Annual Price Preview */}
                          <div className="flex gap-1 w-full">
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-muted/50 border text-[11px] w-full">
                              <span className="text-muted-foreground">
                                Annually:
                              </span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className="font-bold text-foreground">
                                  {/* {curr.symbol || curr.code}{' '} */}
                                  {calculatedAnnual.toLocaleString()}
                                </span>
                                <span className="text-muted-foreground text-[10px]">
                                  / year
                                </span>
                              </div>
                            </div>

                            <div>
                              <Button
                                size="sm"
                                onClick={() => handleSavePrice(curr.code)}
                                disabled={
                                  isSavingCurr ||
                                  !currentMonthly ||
                                  Number(currentMonthly) <= 0
                                }
                                className="w-full sm:w-auto h-8 gap-1.5 self-end sm:self-center">
                                {isSavingCurr ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* <Button
                          size="sm"
                          onClick={() => handleSavePrice(curr.code)}
                          disabled={
                            isSavingCurr ||
                            !currentMonthly ||
                            Number(currentMonthly) <= 0
                          }
                          className="w-full sm:w-auto h-8 gap-1.5 self-end sm:self-center">
                          {isSavingCurr ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Save
                        </Button> */}
                      </div>
                    );
                  })}
              </div>

              {currencies.filter((c) => c.isActive).length === 0 && (
                <p className="text-center py-6 text-sm text-muted-foreground">
                  No active currencies. Please enable currencies in the "Manage
                  Currencies" section first.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
