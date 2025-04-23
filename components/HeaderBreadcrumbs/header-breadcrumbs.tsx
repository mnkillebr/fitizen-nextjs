"use client";

import useSWR from 'swr'
import fetcher from "@/app/lib/fetcher";
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
  const isProgram = pathnameParts[1] === "programs";
  const { data: programName, isLoading: isLoadingProgramName } = useSWR(isProgram && pathnameParts[2] ? `/api/programs?id=${pathnameParts[2]}` : null, fetcher);
  
  const programBreadcrumb = isLoadingProgramName ? pathnameParts[2] : programName && programName.length > 0 ? programName[0].name : pathnameParts[2]
  
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
              <BreadcrumbLink href={`${pathnameParts[0]}/${pathnameParts[1]}/${pathnameParts[2]}`}>{programBreadcrumb}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : pathnameParts.length > 2 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{programBreadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
        {pathnameParts.length > 3 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pathnameParts[3].charAt(0).toUpperCase() + pathnameParts[3].slice(1)}</BreadcrumbPage>
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
