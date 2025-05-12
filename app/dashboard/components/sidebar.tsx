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
        <h1 className="text-xl font-bold text-[#003039]">Loads Africa</h1>
      </div>
      
      <nav className="px-3 py-2">
        <div className="space-y-3">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard">
              <Home className="mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard/loads"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard/loads">
              <PackageOpen className="mr-2" />
              Loads
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard/trucks"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard/trucks">
              <Truck className="mr-2" />
              Trucks
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard/drivers"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard/drivers">
              <Users className="mr-2" />
              Drivers
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard/tracking"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard/tracking">
              <MapPin className="mr-2" />
              Tracking
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-semibold text-lg ",
              pathname === "/dashboard/settings"
                ? "bg-[#003039] text-white hover:bg-[#003039] hover:text-white font-semibold"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href="/dashboard/settings">
              <Settings className="mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}