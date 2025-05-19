
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, 
  SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Building, BarChart3, ShoppingBasket, AlertCircle } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { discrepometroTheme } from "@/lib/theme";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const menuItems = [
    { title: "Empresas", url: "/empresas", icon: Building },
    { title: "Transações", url: "/transacoes", icon: BarChart3 },
    { title: "Estoque", url: "/estoque", icon: ShoppingBasket },
    { title: "Análise de Discrepâncias", url: "/analise", icon: AlertCircle },
  ];

  // Check which menu item is currently active
  const isActive = (url: string) => {
    return location.pathname.startsWith(url);
  };

  return (
    <ThemeProvider theme={discrepometroTheme} defaultTheme="dark">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar>
            <SidebarHeader className="flex items-center justify-center p-4">
              <h2 className="text-xl font-bold text-primary">Discrepômetro</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          isActive={isActive(item.url)} 
                          asChild 
                          tooltip={item.title}
                        >
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <p className="text-xs text-muted-foreground text-center">
                Discrepômetro v1.0
              </p>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1 p-4 md:p-6">
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Discrepômetro</h1>
              </div>
            </header>
            <main className="w-full">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
