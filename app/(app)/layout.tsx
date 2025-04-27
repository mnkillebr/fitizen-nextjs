import { DarkModeToggle } from "@/components/DarkModeToggle";
import { SidebarTrigger, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/AppSidebar/app-sidebar";
import { getCurrentUser } from "../lib/dal";
import { redirect } from "next/navigation";
import { HeaderBreadcrumbs } from "@/components/HeaderBreadcrumbs/header-breadcrumbs";
import { BreadcrumbsProvider } from "@/components/breadcrumbs-provider";

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
    <BreadcrumbsProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="max-w-8xl mx-auto">
          <header className="flex h-16 shrink-0 mx-auto max-w-[1440px] w-full justify-between items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:text-primary" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <HeaderBreadcrumbs />
            </div>
            <div className="pr-6">
              <DarkModeToggle />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 px-6 pt-0 mx-auto max-w-[1440px] w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbsProvider>
  );
}