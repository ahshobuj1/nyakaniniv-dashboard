import {useMemo} from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Coins, ChevronLeft, ChevronRight, TrendingUp} from 'lucide-react';
import type {CurrencyRevenueBreakdown} from '@/features/analytics/type';

interface CurrencyFilterBarProps {
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
  revenueByCurrency?: CurrencyRevenueBreakdown[];
}

interface CurrencyMeta {
  code: string;
  label: string;
  symbol: string;
  flag: string;
  country: string;
}

// Exactly the 10 African currencies supported across UpBeat Africa
const PLATFORM_CURRENCIES: CurrencyMeta[] = [
  // Primary Base (Kenya)
  {
    code: 'KES',
    label: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    country: 'Kenya (Primary Base)',
  },
  // West Africa
  {
    code: 'NGN',
    label: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    country: 'Nigeria',
  },
  {
    code: 'GHS',
    label: 'Ghanaian Cedi',
    symbol: 'GH₵',
    flag: '🇬🇭',
    country: 'Ghana',
  },
  {
    code: 'XOF',
    label: 'West African CFA Franc',
    symbol: 'CFA',
    flag: '🌍',
    country: 'West Africa (UEMOA)',
  },
  // East Africa
  {
    code: 'UGX',
    label: 'Ugandan Shilling',
    symbol: 'USh',
    flag: '🇺🇬',
    country: 'Uganda',
  },
  {
    code: 'TZS',
    label: 'Tanzanian Shilling',
    symbol: 'TSh',
    flag: '🇹🇿',
    country: 'Tanzania',
  },
  {
    code: 'RWF',
    label: 'Rwandan Franc',
    symbol: 'FRw',
    flag: '🇷🇼',
    country: 'Rwanda',
  },
  // Southern & Central Africa
  {
    code: 'ZAR',
    label: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    country: 'South Africa',
  },
  {
    code: 'XAF',
    label: 'Central African CFA Franc',
    symbol: 'FCFA',
    flag: '🌍',
    country: 'Central Africa (CEMAC)',
  },
  {
    code: 'ZMW',
    label: 'Zambian Kwacha',
    symbol: 'ZK',
    flag: '🇿🇲',
    country: 'Zambia',
  },
];

export function CurrencyFilterBar({
  selectedCurrency,
  onSelectCurrency,
  revenueByCurrency = [],
}: CurrencyFilterBarProps) {
  // Map of currencies from actual transaction data
  const breakdownMap = useMemo(() => {
    const map = new Map<string, CurrencyRevenueBreakdown>();
    for (const item of revenueByCurrency) {
      map.set(item.currency.toUpperCase(), item);
    }
    return map;
  }, [revenueByCurrency]);

  // Meta lookup
  const metaMap = useMemo(() => {
    const map = new Map<string, CurrencyMeta>();
    for (const item of PLATFORM_CURRENCIES) {
      map.set(item.code, item);
    }
    return map;
  }, []);

  // List of active currency codes (those with transactions among supported currencies)
  const activeCurrencyCodes = useMemo(() => {
    const fromData = revenueByCurrency
      .map((item) => item.currency.toUpperCase())
      .filter((code) => metaMap.has(code));
    const combined = Array.from(new Set(['KES', ...fromData]));
    return combined;
  }, [revenueByCurrency, metaMap]);

  // Cycle / swipe previous currency
  const handlePrevious = () => {
    const currentCode = selectedCurrency.toUpperCase();
    const idx = activeCurrencyCodes.indexOf(currentCode);
    if (idx === -1) {
      onSelectCurrency(activeCurrencyCodes[0]);
    } else {
      const prevIdx = idx <= 0 ? activeCurrencyCodes.length - 1 : idx - 1;
      onSelectCurrency(activeCurrencyCodes[prevIdx]);
    }
  };

  // Cycle / swipe next currency
  const handleNext = () => {
    const currentCode = selectedCurrency.toUpperCase();
    const idx = activeCurrencyCodes.indexOf(currentCode);
    if (idx === -1) {
      onSelectCurrency(activeCurrencyCodes[0]);
    } else {
      const nextIdx = idx >= activeCurrencyCodes.length - 1 ? 0 : idx + 1;
      onSelectCurrency(activeCurrencyCodes[nextIdx]);
    }
  };

  const currentMeta = metaMap.get(selectedCurrency.toUpperCase()) || {
    code: selectedCurrency.toUpperCase(),
    label: selectedCurrency.toUpperCase(),
    symbol: selectedCurrency.toUpperCase(),
    flag: '🌍',
    country: 'Regional',
  };

  const currentData = breakdownMap.get(selectedCurrency.toUpperCase());
  const currentAmount = currentData ? Number(currentData.amount || 0) : 0;
  const currentCount = currentData ? currentData.count : 0;

  // Platform supported currencies not yet in active data list
  const otherSupportedCurrencies = PLATFORM_CURRENCIES.filter(
    (c) => !activeCurrencyCodes.includes(c.code),
  );

  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title & Explainer */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Coins size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Platform Currency & Revenue Switcher
              </h2>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 border-primary/30 text-primary bg-primary/5">
                African Regional
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select or swipe across currencies to isolate platform revenue and
              analytics
            </p>
          </div>
        </div>

        {/* Right: Controls (Swipe Arrow Buttons + Select Dropdown + Active Metric Pill) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Revenue Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/40 text-xs">
            <span className="text-muted-foreground font-medium">
              Collected:
            </span>
            <span className="font-mono font-bold text-foreground">
              {currentMeta.symbol}{' '}
              {currentAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={11} />
              <span>
                {currentCount} {currentCount === 1 ? 'tx' : 'txs'}
              </span>
            </span>
          </div>

          {/* Swipe / Step Arrow Buttons + Dropdown */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handlePrevious}
              title="Swipe to previous currency"
              className="h-9 w-9 shrink-0">
              <ChevronLeft size={16} />
            </Button>

            <Select
              value={selectedCurrency.toUpperCase()}
              onValueChange={(val) => onSelectCurrency(val)}>
              <SelectTrigger className="h-9 min-w-[200px] sm:min-w-[240px] text-xs font-medium">
                <SelectValue placeholder="Select currency">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{currentMeta.flag}</span>
                    <span className="font-bold font-mono text-foreground">
                      {currentMeta.code}
                    </span>
                    <span className="text-muted-foreground text-xs truncate">
                      — {currentMeta.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>

              <SelectContent className="max-h-80">
                {/* Group 1: Active Currencies with Transactions */}
                <SelectGroup>
                  <SelectLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                    Active Currencies ({activeCurrencyCodes.length})
                  </SelectLabel>
                  {activeCurrencyCodes.map((code) => {
                    const meta = metaMap.get(code) || {
                      code,
                      label: code,
                      symbol: code,
                      flag: '🌍',
                      country: 'Regional',
                    };
                    const item = breakdownMap.get(code);
                    const amount = item ? Number(item.amount || 0) : 0;
                    const count = item ? item.count : 0;

                    return (
                      <SelectItem
                        key={code}
                        value={code}
                        className="text-xs cursor-pointer py-2">
                        <div className="flex items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{meta.flag}</span>
                            <span className="font-bold font-mono">{code}</span>
                            <span className="text-muted-foreground text-[11px]">
                              ({meta.label})
                            </span>
                            {code === 'KES' && (
                              <Badge className="text-[9px] px-1 py-0 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="text-right font-mono text-[11px] shrink-0 text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {meta.symbol}{' '}
                              {amount.toLocaleString('en-US', {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                            <span className="ml-1 text-[10px] text-muted-foreground">
                              ({count} tx)
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>

                {otherSupportedCurrencies.length > 0 && <SelectSeparator />}

                {/* Group 2: Other Supported Platform Currencies */}
                {otherSupportedCurrencies.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                      Other Supported Currencies (
                      {otherSupportedCurrencies.length})
                    </SelectLabel>
                    {otherSupportedCurrencies.map((meta) => (
                      <SelectItem
                        key={meta.code}
                        value={meta.code}
                        className="text-xs cursor-pointer py-1.5">
                        <div className="flex items-center justify-between w-full gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{meta.flag}</span>
                            <span className="font-bold font-mono">
                              {meta.code}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              — {meta.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            0 tx
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleNext}
              title="Swipe to next currency"
              className="h-9 w-9 shrink-0">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
