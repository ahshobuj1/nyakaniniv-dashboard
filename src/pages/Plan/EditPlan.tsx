/* eslint-disable @typescript-eslint/no-explicit-any */
import {Button} from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {useIsMobile} from '@/hooks/use-mobile';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {useUpdatePlanMutation} from '@/features/plans/plansApi';
import {editPlanSchema, FEATURE_KEYS, type IPlan} from './type';

type Props = {
  item: IPlan;
  trigger: React.ReactNode;
};

const EditPlan = ({item, trigger}: Props) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const [updatePlan, {isLoading}] = useUpdatePlanMutation();

  const mappedFeatures = item.features || {};

  const defaultValues = {
    id: item.id,
    name: item.name,
    priceMonthly: Number(item.priceMonthly),
    priceAnnually: Number(item.priceAnnually),
    discountPercentage: item.discountPercentage,
    features: mappedFeatures,
  };

  const form = useForm<any>({
    resolver: zodResolver(editPlanSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, item, form]);

  const priceMonthly = form.watch('priceMonthly');
  const discountPercentage = form.watch('discountPercentage');

  useEffect(() => {
    const monthly = Number(priceMonthly) || 0;
    const discount = Number(discountPercentage) || 0;
    const annual = (monthly * 12) * (1 - (discount / 100));
    form.setValue('priceAnnually', Number(annual.toFixed(2)));
  }, [priceMonthly, discountPercentage, form]);

  const onSubmit = async (data: any) => {
    try {
      const featuresObj = { ...data.features };

      await updatePlan({
        id: item?.id,
        data: {
          ...data,
          features: featuresObj,
          id: undefined,
        },
      }).unwrap();

      toast.success('Plan updated successfully');
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update plan');
    }
  };

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      open={open}
      onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>Edit plan details</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form className="space-y-5">
              {/* Plan Name */}
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Plan name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prices */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="priceMonthly"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Monthly Price (KES)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceAnnually"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Annual Price (KES) - Auto Calculated</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Discount Percentage */}
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Discount Percentage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Features – line per feature */}
              <FormField
                control={form.control}
                name="features"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <div className="space-y-4">
                      {FEATURE_KEYS.map((key) => {
                        const isNumber = key === 'MAX_EVENTS';
                        return (
                          <div key={key} className="flex justify-between items-center p-3 border rounded-md">
                            <span className="text-sm font-medium">{key.replace(/_/g, ' ')} {isNumber && '(Number)'}</span>
                            
                            {isNumber ? (
                              <Input
                                type="number"
                                className="w-[100px]"
                                value={field.value?.[key] ?? -1}
                                onChange={(e) => {
                                  field.onChange({
                                    ...field.value,
                                    [key]: e.target.valueAsNumber,
                                  });
                                }}
                              />
                            ) : (
                              <Checkbox
                                checked={field.value?.[key] ?? false}
                                onCheckedChange={(chk) => {
                                  field.onChange({
                                    ...field.value,
                                    [key]: !!chk,
                                  });
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {isLoading ? 'Saving...' : 'Update Plan'}
          </Button>

          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditPlan;
