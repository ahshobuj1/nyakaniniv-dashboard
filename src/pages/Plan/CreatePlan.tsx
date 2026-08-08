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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {toast} from 'sonner';
import {useState} from 'react'  ;

import {PlanCreateSchema} from './type';
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
      features: [''],
    },
  });

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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceMonthly"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Monthly Price ($)</FormLabel>
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
                      <FormLabel>Annual Price ($)</FormLabel>
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
                      <datalist id="feature-keys">
                        <option value="MAX_EVENTS" />
                        <option value="BASIC_PROFILE" />
                        <option value="MANUAL_BOOKINGS" />
                        <option value="CUSTOM_SUBDOMAIN" />
                        <option value="BASIC_ANALYTICS" />
                        <option value="MULTIPLE_THEMES" />
                        <option value="ONLINE_PAYMENTS" />
                        <option value="AUTOMATED_INVOICING" />
                        <option value="EMAIL_NOTIFICATIONS" />
                        <option value="CUSTOM_DOMAIN" />
                        <option value="REMOVE_BRANDING" />
                        <option value="PRIORITY_SUPPORT" />
                        <option value="ADVANCED_ANALYTICS" />
                      </datalist>

                      {field.value?.map((feature: any, index: number) => (
                        <div key={index} className="flex flex-wrap gap-2 items-center p-2 border rounded-md">
                          <Input
                            list="feature-keys"
                            placeholder="Key (e.g. MAX_EVENTS)"
                            value={feature.key}
                            onChange={(e) => {
                              const updated = [...field.value];
                              updated[index].key = e.target.value;
                              field.onChange(updated);
                            }}
                            className="flex-1 min-w-[150px]"
                          />
                          
                          <Select
                            value={feature.valueType}
                            onValueChange={(val) => {
                              const updated = [...field.value];
                              updated[index].valueType = val;
                              field.onChange(updated);
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="string">String</SelectItem>
                            </SelectContent>
                          </Select>

                          {feature.valueType === 'boolean' && (
                            <div className="flex items-center w-[100px] justify-center">
                              <Checkbox
                                checked={feature.valueBoolean}
                                onCheckedChange={(chk) => {
                                  const updated = [...field.value];
                                  updated[index].valueBoolean = !!chk;
                                  field.onChange(updated);
                                }}
                              />
                            </div>
                          )}

                          {feature.valueType === 'number' && (
                            <Input
                              type="number"
                              className="w-[100px]"
                              value={feature.valueNumber || 0}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].valueNumber = e.target.valueAsNumber;
                                field.onChange(updated);
                              }}
                            />
                          )}

                          {feature.valueType === 'string' && (
                            <Input
                              className="w-[100px]"
                              value={feature.valueString || ''}
                              onChange={(e) => {
                                const updated = [...field.value];
                                updated[index].valueString = e.target.value;
                                field.onChange(updated);
                              }}
                            />
                          )}

                          <Button
                            type="button"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((_: any, i: number) => i !== index)
                              );
                            }}>
                            ✕
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 border-dashed"
                        onClick={() =>
                          field.onChange([...(field.value || []), { key: '', valueType: 'boolean', valueBoolean: true }])
                        }>
                        + Add Feature Property
                      </Button>
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
