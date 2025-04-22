"use client"

import clsx from "clsx";
import { Search } from "lucide-react"
import { useState } from "react";
import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname, useRouter, useSearchParams, } from "next/navigation";

export function SidebarSearchForm({ ...props }: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();

  const [headerSearch, setHeaderSearch] = useState(searchParams.get("q") ?? "")
  const showSearch =
    pathname === "/workouts" ||
    pathname === "/exercises" ||
    pathname === "/programs"

  if (open) {
    return (
      <form {...props}>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              type="search"
              placeholder={`Search ${showSearch ? pathname.split(`/`).pop() : ""} ...`}
              name="q"
              autoComplete="off"
              value={headerSearch}
              onChange={(e) => {
                !e.target.value && router.push(pathname)
                setHeaderSearch(e.target.value)
              }}
              className={clsx(
                "w-full appearance-none border bg-background pl-8 shadow-none",
                "dark:bg-background dark:text-muted-foreground dark:focus:text-foreground",
                "dark:border-border-muted dark:focus:border-ring focus-visible:ring-0"
              )}
              disabled={!showSearch}
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
    )
  }
}
