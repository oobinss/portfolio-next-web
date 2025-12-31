"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    current: number;
    total: number;
    search?: string;
}

export default function Pagination({ current, total, search }: PaginationProps) {
    const router = useRouter();
    if (total <= 1) return null;

    const handlePageChange = (page: number) => {
        router.push(
            `/board?page=${page}${
                search ? `&search=${encodeURIComponent(search)}` : ""
            }`
        );
    };

    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <nav
            className="flex justify-center items-center gap-1 mt-8"
            aria-label="페이지 네비게이션"
        >
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(current - 1)}
                disabled={current === 1}
                className="h-9 w-9 p-0"
                aria-label="이전 페이지"
            >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>

            {getPageNumbers().map(page => (
                <Button
                    key={page}
                    variant={current === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={current === page}
                    className={cn(
                        "h-9 min-w-9",
                        current === page && "bg-stone-900 hover:bg-stone-800"
                    )}
                    aria-label={`페이지 ${page}로 이동`}
                    aria-current={current === page ? "page" : undefined}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(current + 1)}
                disabled={current === total}
                className="h-9 w-9 p-0"
                aria-label="다음 페이지"
            >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
        </nav>
    );
}


