import * as React from 'react';
import {
  IconDashboard,
  IconUsers,
  IconUsersGroup,
  IconCalendarEvent,
  IconReceipt2,
  IconPalette,
  IconHeadphones,
} from '@tabler/icons-react';

import {NavMain} from '@/components/nav-main';
import {NavUser} from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {Link} from 'react-router';
import { useGetLandingPageQuery } from '@/features/landing-page/landingPageApi';

const data = {
  user: {
    name: 'shadcn',
    email: 'ahshobuj@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: IconUsers,
    },
    {
      title: 'Tenants',
      url: '/dashboard/tenants',
      icon: IconUsersGroup,
    },
    {
      title: 'Bookings',
      url: '/dashboard/bookings',
      icon: IconCalendarEvent,
    },
    {
      title: 'Plans',
      url: '/dashboard/plans',
      icon: IconReceipt2,
    },
    {
      title: 'Themes',
      url: '/dashboard/themes',
      icon: IconPalette,
    },
    {
      title: 'Transactions',
      url: '/dashboard/transactions',
      icon: IconReceipt2,
    },
    {
      title: 'Landing Page',
      url: '/dashboard/landing-page',
      icon: IconPalette,
    },
    {
      title: 'Support Tickets',
      url: '/dashboard/support-tickets',
      icon: IconHeadphones,
    },
  ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const { data: landingData } = useGetLandingPageQuery();
  const logoUrl = landingData?.data?.settings?.headerLogoUrl || '/upbeat.png';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/dashboard" className="flex items-center gap-2">
                <img src={logoUrl} alt="logo" width={32} height={32} className='mb-1 shrink-0 h-8 w-8 object-contain' />

                <span className="text-sm font-semibold truncate">
                  UpBeat <span className="text-primary">Entertainment Africa</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
