"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { LogoIcon } from '@/components/icons/logo-icon';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Painel de Chamadas', icon: Home },
  { href: '/history', label: 'Histórico de Chamadas', icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8 text-sidebar-primary group-data-[collapsible=icon]:mx-auto" />
          <span className="text-lg font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">
            Central 193
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', className: 'ml-1' }}
                  className="justify-start"
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton 
                className="justify-start"
                tooltip={{ children: 'Configurações', side: 'right', className: 'ml-1' }}
             >
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
