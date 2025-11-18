import { NavMain } from '@/components/nav-main';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, LayoutGrid, List, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isAdmin = auth.user.role === 'admin';
    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const mainNavItems: NavItem[] = [
        {
            title: 'My Tickets',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'All Requests',
            href: '/requests',
            icon: List,
        },
        ...(isAdmin ? [{
            title: 'Manage Users',
            href: '/admin/users',
            icon: Users,
        }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={toggleSidebar}
                        className={`h-10 ${isCollapsed ? 'w-10 px-0' : 'w-full justify-start mx-2'}`}
                    >
                        <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                        {!isCollapsed && <span className="ml-2">Collapse</span>}
                    </Button>
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
