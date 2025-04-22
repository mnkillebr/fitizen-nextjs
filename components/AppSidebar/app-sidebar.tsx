import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { SidebarHeaderButton } from "./sidebar-header-button"
import { User } from "@/db/schema"
import { SidebarSearchForm } from "./sidebar-search"
export function AppSidebar({ user, ...props }: { user: typeof User.$inferSelect } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderButton />
        <SidebarSearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> 
      </SidebarFooter>
    </Sidebar>
  )
}
