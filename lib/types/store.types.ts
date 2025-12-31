// Gallery Store 타입
export interface GalleryStore {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: "newest" | "oldest";
    setSortBy: (sortBy: "newest" | "oldest") => void;
    reset: () => void;
}

// Board Store 타입
export interface BoardStore {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    perPage: number;
    setPerPage: (perPage: number) => void;
    selectedPostId: number | null;
    setSelectedPostId: (id: number | null) => void;
    filters: {
        isSecret: boolean | null;
    };
    setFilter: (key: string, value: boolean | null) => void;
    reset: () => void;
}

// UI Store 타입
export interface UIStore {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    modals: Record<string, boolean>;
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    notification: string | null;
    setNotification: (notification: string | null) => void;
    clearNotification: () => void;
}


