"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { menuItems } from "@/lib/constants/menu";

interface DashboardSidebarProps {
  userRoles: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({
  userRoles,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  // Determinar qué menú mostrar basado en los roles
  const menu = menuItems[userRoles[0]]


  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50
        flex h-[calc(100vh-65px)] w-64 flex-col border-r bg-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Roles Activos
            </h3>
            <div className="mt-2 space-y-1">
              {userRoles?.map((role) => (
                <div
                  key={role}
                  className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
