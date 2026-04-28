"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  // Build page numbers: always show first, last, current ±1, with ellipsis
  function getPageNumbers(): (number | "...")[] {
    const delta = 1;
    const range: number[] = [];

    for (
      let i = Math.max(0, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | "...")[] = [];

    if (range[0] > 0) {
      pages.push(0);
      if (range[0] > 1) pages.push("...");
    }

    pages.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
            className={
              page === currentPage
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                : ""
            }
          >
            {page + 1}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
