import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image";
import logo from "@/assets/fitizen-logo.svg";
import Link from "next/link";

export function SidebarHeaderButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Image
              unoptimized
              className="size-12 rounded-full"
              src={logo}
              alt="Fitizen"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Fitizen
              </span>
              <span className="truncate text-xs">Free tier</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}