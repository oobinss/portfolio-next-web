import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIStore } from "../types/store.types";

// UI 상태 관리 스토어
export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            // 사이드바 열림/닫힘 상태
            sidebarOpen: false,
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            // 모달 상태
            modals: {},
            openModal: (modalId) => set((state) => ({
                modals: { ...state.modals, [modalId]: true },
            })),
            closeModal: (modalId) => set((state) => ({
                modals: { ...state.modals, [modalId]: false },
            })),

            // 로딩 상태
            loading: false,
            setLoading: (loading) => set({ loading }),

            // 알림 메시지
            notification: null,
            setNotification: (notification) => set({ notification }),
            clearNotification: () => set({ notification: null }),
        }),
        {
            name: "ui-storage",
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
            }),
        }
    )
);


