"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function HeaderBreadcrumbs() {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {pathnameParts.length > 2 ? (
            <BreadcrumbLink href={`${pathnameParts[0]}/${pathnameParts[1]}`}>{pathnameParts[1].charAt(0).toUpperCase() + pathnameParts[1].slice(1)}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{pathnameParts[1].charAt(0).toUpperCase() + pathnameParts[1].slice(1)}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {pathnameParts.length > 3 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`${pathnameParts[0]}/${pathnameParts[1]}/${pathnameParts[2]}`}>{pathnameParts[2]}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : pathnameParts.length > 2 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pathnameParts[2]}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
        {/* <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
