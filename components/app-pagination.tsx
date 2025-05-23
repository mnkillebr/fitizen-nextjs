"use client";

import { ChevronLeft, ChevronRight } from "@/assets/icons";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AppPaginationProps = {
  page: number;
  totalPages: number;
}

export function AppPagination({ page, totalPages }: AppPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (pageNum: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pageNum.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const getSiblingPages = () => {
    const siblings: number[] = [];
    const show = 2; // Show 2 siblings on each side when possible

    for (let i = Math.max(1, page - show); i <= Math.min(totalPages, page + show); i++) {
      siblings.push(i);
    }

    return siblings;
  };

  return (
    <div className="flex justify-center my-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(page - 1)}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </PaginationLink>
          </PaginationItem>

          {page > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {getSiblingPages().map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => handlePageChange(pageNum)}
                isActive={pageNum === page}
                className={pageNum === page ? "bg-primary text-primary-foreground" : ""}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {page < totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(page + 1)}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}