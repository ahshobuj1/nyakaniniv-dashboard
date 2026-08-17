import { useGetLandingPageQuery } from '@/features/landing-page/landingPageApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

import { HeroTab } from './components/HeroTab';
import { StepsTab } from './components/StepsTab';
import { ServicesTab } from './components/ServicesTab';
import { FaqsTab } from './components/FaqsTab';
import { SocialTab } from './components/SocialTab';

export default function LandingPageCMS() {
  const { data, isLoading } = useGetLandingPageQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const landingData = data?.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Page CMS</h1>
          <p className="text-muted-foreground">Manage your landing page content and sections.</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto h-auto gap-2">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="steps">How It Works</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="socials">Footer Socials</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroTab hero={landingData?.hero || null} />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab services={landingData?.services || []} />
        </TabsContent>

        <TabsContent value="steps">
          <StepsTab steps={landingData?.steps || []} />
        </TabsContent>

        <TabsContent value="faqs">
          <FaqsTab faqs={landingData?.faqs || []} />
        </TabsContent>

        <TabsContent value="socials">
          <SocialTab socials={landingData?.socials || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
