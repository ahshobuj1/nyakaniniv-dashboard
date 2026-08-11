'use client';

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
import {toast} from 'sonner';
import {useState, useEffect} from 'react';

import {PlanCreateSchema, FEATURE_KEYS} from './type';
import {useCreatePlanMutation} from '@/features/plans/plansApi';

function CreatePlan({trigger}: {trigger: React.ReactNode}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [createPlan, {isLoading}] = useCreatePlanMutation();

  const form = useForm<any>({
    resolver: zodResolver(PlanCreateSchema),
    defaultValues: {
      priceMonthly: 0,
      priceAnnually: 0,
      discountPercentage: 0,
      features: {},
    },
  });

  const priceMonthly = form.watch('priceMonthly');
  const discountPercentage = form.watch('discountPercentage');

  useEffect(() => {
    const monthly = Number(priceMonthly) || 0;
    const discount = Number(discountPercentage) || 0;
    const annual = Math.round((monthly * 12) * (1 - (discount / 100)));
    form.setValue('priceAnnually', annual);
  }, [priceMonthly, discountPercentage, form]);


  const onSubmit = async (data: any) => {
    try {
      const res = await createPlan(data).unwrap();
      console.log('[plan create response]', res);
      toast.success('Plan created successfully');
      form.reset();
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      toast.error('Failed to create plan');
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
          <DrawerTitle>Create Plan</DrawerTitle>
          <DrawerDescription>
            Create subscription plan for dashboard
          </DrawerDescription>
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
                      <Input placeholder="Enterprise" {...field} />
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

              {/* Features (comma separated) */}
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
            {isLoading ? 'Creating...' : 'Create Plan'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreatePlan;
