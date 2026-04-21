"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationBarProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationBar({
  page,
  totalPages,
  from,
  to,
  total,
  onPrev,
  onNext,
}: PaginationBarProps) {
  return (
    <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
      <span className="text-xs text-on-surface-variant font-medium">
        Showing <span className="font-bold text-on-surface">{from}</span>–
        <span className="font-bold text-on-surface">{to}</span> of{" "}
        <span className="font-bold text-on-surface">{total}</span>
      </span>
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={onPrev}
          className="rounded-lg"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-xs font-bold text-on-surface px-2">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          disabled={page >= totalPages}
          onClick={onNext}
          className="rounded-lg"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
