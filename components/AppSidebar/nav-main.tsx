"use client"

import clsx from "clsx"
import {
  BookOpen,
  Calendar,
  ChartLine,
  Flame,
  LayoutDashboard,
  Table,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Programs",
    url: "/programs",
    icon: Table,
  },
  {
    title: "Workouts",
    url: "/workouts",
    icon: Flame,
  },
  {
    title: "Exercise Library",
    url: "/exercises",
    icon: BookOpen,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  // {
  //   title: "Statistics",
  //   url: "app/stats",
  //   icon: ChartLine,
  // },
]

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navLinks.map((item, item_idx) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item_idx}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive} 
                >
                  {item.icon && <item.icon className={clsx("size-4", isActive ? "text-primary" : "")} />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
