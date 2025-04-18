"use client";

import { ThemeProvider } from "@/components/theme-provider";
import {
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// import { logout } from "@/components/actions/logout-action";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { logout } from "../actions/logout-action";
// import { CopilotPopup } from "@copilotkit/react-ui";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <aside className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <nav className="space-y-1 p-4">
          {/* {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })} */}
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}