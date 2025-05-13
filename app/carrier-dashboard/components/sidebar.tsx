'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageOpen,Truck, Globe, Home, Settings, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#008080]">Loads Africa</h1>
      </div>
      
      <nav className="px-3 py-2">
        <div className="space-y-3">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard">
              <Home className="mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard/loads"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard/loads">
              <PackageOpen className="mr-2" />
              Loads
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard/trucks"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard/trucks">
              <Truck className="mr-2" />
              My Trucks
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard/drivers"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard/drivers">
              <Users className="mr-2" />
              My Drivers
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard/tracking"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard/tracking">
              <MapPin className="mr-2" />
              Tracking
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/carrier-dashboard/settings"
                ? "bg-[#008080] text-white hover:bg-[#008080] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/carrier-dashboard/settings">
              <Settings className="mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}