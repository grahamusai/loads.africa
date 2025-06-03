'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageOpen, Truck, Globe, Home, Settings, Users, MapPin, Package, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/carrier-dashboard",
    icon: Home,
  },
  {
    title: "All Loads",
    href: "/carrier-dashboard/loads",
    icon: Package,
  },
  {
    title: "My Loads",
    href: "/carrier-dashboard/my-loads",
    icon: PackageOpen,
  },
  {
    title: "My Trucks",
    href: "/carrier-dashboard/trucks",
    icon: Truck,
  },
  {
    title: "My Drivers",
    href: "/carrier-dashboard/drivers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/carrier-dashboard/settings",
    icon: Settings,
  },
];

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>
      
      <nav className="flex-1 px-3 py-2">
        <div className="space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start font-semibold text-lg",
                  pathname === item.href
                    ? "bg-[#1b858f] text-white hover:bg-[#1b858f] hover:text-white font-semibold"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={onItemClick}
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-md">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border">
            <SidebarContent onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  );
}