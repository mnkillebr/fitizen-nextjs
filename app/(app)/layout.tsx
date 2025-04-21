import { DarkModeToggle } from "@/components/DarkModeToggle";
import { SidebarTrigger, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/AppSidebar/app-sidebar";
import { getCurrentUser } from "../lib/dal";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="max-w-8xl mx-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 hover:text-primary" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="pr-4">
              <DarkModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 px-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}