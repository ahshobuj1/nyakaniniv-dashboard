import {NavLink} from 'react-router';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {cn} from '@/lib/utils';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    badge?: number | string;
  }[];
}) {
  const {state} = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                end={item.url === '/dashboard'} // ensure exact match for dashboard
                className={({isActive}) =>
                  cn(
                    'relative group/navitem transition-all duration-200 rounded-lg border-2 flex items-center gap-3 px-3 py-3',
                    isActive
                      ? 'bg-primary border text-background shadow-lg'
                      : 'bg-transparent border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md'
                  )
                }>
                {({isActive}) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full shadow-sm" />
                    )}

                    {/* Icon with collapsed dot */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      {item.icon && (
                        <item.icon
                          className={cn(
                            'w-5 h-5 transition-transform duration-200 shrink-0',
                            isActive
                              ? 'text-background'
                              : 'text-muted-foreground group-hover/navitem:text-foreground group-hover/navitem:scale-110'
                          )}
                        />
                      )}
                      {/* Floating notification dot when sidebar is collapsed */}
                      {isCollapsed && Boolean(item.badge) && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
                      )}
                    </div>

                    {/* Title */}
                    <span
                      className={cn(
                        'font-medium transition-all duration-200 truncate flex-1',
                        isActive
                          ? 'text-background font-semibold'
                          : 'group-hover/navitem:text-foreground'
                      )}>
                      {item.title}
                    </span>

                    {/* Badge when sidebar is expanded */}
                    {!isCollapsed && item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                      <span
                        className={cn(
                          'ml-auto text-xs font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors shadow-2xs',
                          isActive
                            ? 'bg-white text-primary'
                            : 'bg-rose-500 text-white'
                        )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
