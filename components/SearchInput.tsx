"use client";

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import clsx from "clsx"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchInput({ searchField }: { searchField: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newSearchParams.set("q", debouncedSearch);
    } else {
      newSearchParams.delete("q");
    }
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  return (
    <div className="relative mb-2">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        id="search"
        type="search"
        placeholder={`Search ${searchField} ...`}
        name="q"
        autoComplete="off"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={clsx(
          "w-full appearance-none border bg-background pl-8 shadow-none",
          "dark:bg-background dark:text-muted-foreground dark:focus:text-foreground",
          "dark:border-border-muted dark:focus:border-ring focus-visible:ring-0"
        )}
      />
      <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </div>
  )
}