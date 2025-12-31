import { create } from "zustand";
import type { BoardStore } from "../types/store.types";

// 게시판 상태 관리
export const useBoardStore = create<BoardStore>((set) => ({
    // 검색어
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),

    // 현재 페이지
    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),

    // 페이지당 항목 수
    perPage: 10,
    setPerPage: (perPage) => set({ perPage }),

    // 선택된 게시글 ID (상세보기 등)
    selectedPostId: null,
    setSelectedPostId: (id) => set({ selectedPostId: id }),

    // 필터 옵션
    filters: {
        isSecret: null, // null: 전체, true: 비밀글만, false: 일반글만
    },
    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),

    // 초기화
    reset: () =>
        set({
            searchQuery: "",
            currentPage: 1,
            perPage: 10,
            selectedPostId: null,
            filters: { isSecret: null },
        }),
}));


