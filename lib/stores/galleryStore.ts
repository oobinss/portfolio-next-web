import { create } from "zustand";
import type { GalleryStore } from "../types/store.types";

// 갤러리 필터 상태 관리
export const useGalleryStore = create<GalleryStore>((set) => ({
    selectedCategory: "전체",
    setSelectedCategory: (category) => set({ selectedCategory: category }),

    // 검색어
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),

    // 정렬 옵션
    sortBy: "newest",
    setSortBy: (sortBy) => set({ sortBy }),

    // 초기화
    reset: () =>
        set({
            selectedCategory: "전체",
            searchQuery: "",
            sortBy: "newest",
        }),
}));


