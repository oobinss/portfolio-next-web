"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getGalleryItems,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
} from "../api/gallery";
import type {
    CreateGalleryRequest,
    UpdateGalleryRequest,
    GalleryItemResponse,
} from "../types/api.types";
import type { GalleryListItem } from "../gallery";
import type { AxiosError } from "axios";

// Query Keys
export const galleryKeys = {
    all: ["gallery"] as const,
    lists: () => [...galleryKeys.all, "list"] as const,
    list: () => [...galleryKeys.lists()] as const,
    details: () => [...galleryKeys.all, "detail"] as const,
    detail: (id: number) => [...galleryKeys.details(), id] as const,
};

interface UseGalleryItemsOptions {
    enabled?: boolean;
}

interface UseGalleryItemOptions {
    enabled?: boolean;
}

// 갤러리 목록 조회
export function useGalleryItems(options: UseGalleryItemsOptions = {}) {
    const { enabled = true } = options;
    return useQuery<GalleryListItem[], AxiosError>({
        queryKey: galleryKeys.list(),
        queryFn: getGalleryItems,
        enabled,
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });
}

// 갤러리 상세 조회
export function useGalleryItem(id: number | undefined, options: UseGalleryItemOptions = {}) {
    const { enabled = true } = options;
    return useQuery<GalleryItemResponse, AxiosError>({
        queryKey: galleryKeys.detail(id!),
        queryFn: () => getGalleryItem(id!),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });
}

// 갤러리 생성
export function useCreateGalleryItem() {
    const queryClient = useQueryClient();

    return useMutation<GalleryItemResponse, AxiosError, CreateGalleryRequest>({
        mutationFn: createGalleryItem,
        onSuccess: () => {
            // 갤러리 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "갤러리 등록 중 오류가 발생했습니다.";
            console.error("갤러리 생성 오류:", errorMessage);
        },
    });
}

interface UpdateGalleryItemVariables {
    id: number;
    data: UpdateGalleryRequest;
}

// 갤러리 수정
export function useUpdateGalleryItem() {
    const queryClient = useQueryClient();

    return useMutation<GalleryItemResponse, AxiosError, UpdateGalleryItemVariables>({
        mutationFn: ({ id, data }) => updateGalleryItem(id, data),
        onSuccess: (_data, variables) => {
            // 해당 갤러리 상세 캐시 업데이트
            queryClient.invalidateQueries({ queryKey: galleryKeys.detail(variables.id) });
            // 갤러리 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
        },
    });
}

// 갤러리 삭제
export function useDeleteGalleryItem() {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean }, AxiosError, number>({
        mutationFn: deleteGalleryItem,
        onSuccess: () => {
            // 갤러리 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "갤러리 삭제 중 오류가 발생했습니다.";
            console.error("갤러리 삭제 오류:", errorMessage);
        },
    });
}


