"use client";

import { useSession } from "next-auth/react";
import GalleryGrid from "@/app/components/gallery/gallery-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useGalleryStore } from "@/lib/stores/galleryStore";
import { useGalleryItems } from "@/lib/hooks/useGallery";
import { useMemo } from "react";
import GalleryGridSkeleton from "./gallery-grid-skeleton";
import type { GalleryListItem } from "@/lib/gallery";

const categories = ["전체", "음식", "여행", "일상"] as const;

interface GalleryCategoryFilterProps {
    items?: GalleryListItem[];
    showUploadButton?: boolean;
}

export default function GalleryCategoryFilter({
    items: initialItems,
    showUploadButton,
}: GalleryCategoryFilterProps) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";

    // Zustand store에서 필터 상태 가져오기
    const selectedCategory = useGalleryStore(state => state.selectedCategory);
    const setSelectedCategory = useGalleryStore(
        state => state.setSelectedCategory
    );

    // TanStack Query로 갤러리 데이터 가져오기 (서버에서 받은 initialItems가 있으면 사용)
    const { data: queryItems, isLoading } = useGalleryItems({
        enabled: !initialItems || initialItems.length === 0,
    });

    // 필터링된 갤러리
    const filteredGallery = useMemo((): GalleryListItem[] => {
        // 초기 데이터 또는 쿼리 데이터 사용
        // 서버에서 이미 thumbnail이 생성되어 있으므로 그대로 사용
        const items = initialItems || queryItems || [];
        return items.filter(item =>
            selectedCategory === "전체"
                ? true
                : item.category === selectedCategory
        );
    }, [initialItems, queryItems, selectedCategory]);

    if (isLoading && !initialItems) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                        프로젝트 갤러리
                    </h2>
                </div>
                <div className="flex justify-center mb-10">
                    <div className="flex flex-wrap gap-3">
                        {categories.map(category => (
                            <div
                                key={category}
                                className="h-10 w-20 bg-stone-200 rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                </div>
                <GalleryGridSkeleton />
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                    주요 사업영역
                </h2>
                {showUploadButton && isAdmin && (
                    <Link href="/gallery/new" aria-label="새 갤러리 항목 추가하기">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            사진 올리기
                        </Button>
                    </Link>
                )}
            </div>
            <div className="flex justify-center mb-10">
                <div
                    className="flex flex-wrap gap-3"
                    role="tablist"
                    aria-label="갤러리 카테고리 필터"
                >
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            role="tab"
                            aria-selected={selectedCategory === category}
                            aria-label={`${category} 카테고리 필터${selectedCategory === category ? " (선택됨)" : ""}`}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                                "transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2",
                                selectedCategory === category
                                    ? "bg-stone-900 text-white shadow-lg shadow-stone-900/20 scale-105"
                                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 hover:shadow-md"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <GalleryGrid items={filteredGallery} />
        </div>
    );
}

