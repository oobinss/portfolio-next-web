"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    verifyPostPassword,
} from "../api/board";
import type {
    CreatePostRequest,
    UpdatePostRequest,
    PostsResponse,
    PostResponse,
    VerifyPasswordResponse,
    PaginationParams,
} from "../types/api.types";
import type { AxiosError } from "axios";

// Query Keys
export const postKeys = {
    all: ["posts"] as const,
    lists: () => [...postKeys.all, "list"] as const,
    list: (filters: PaginationParams) => [...postKeys.lists(), filters] as const,
    details: () => [...postKeys.all, "detail"] as const,
    detail: (id: number) => [...postKeys.details(), id] as const,
};

interface UsePostsOptions {
    search?: string;
    page?: number;
    perPage?: number;
    enabled?: boolean;
}

interface UsePostOptions {
    enabled?: boolean;
}

// 게시글 목록 조회
export function usePosts(options: UsePostsOptions = {}) {
    const { search = "", page = 1, perPage = 10, enabled = true } = options;
    return useQuery<PostsResponse, AxiosError>({
        queryKey: postKeys.list({ search, page, perPage }),
        queryFn: () => getPosts({ search, page, perPage }),
        enabled,
        staleTime: 1000 * 60 * 2, // 2분간 fresh 상태 유지
    });
}

// 게시글 상세 조회
export function usePost(id: number | undefined, options: UsePostOptions = {}) {
    const { enabled = true } = options;
    return useQuery<PostResponse, AxiosError>({
        queryKey: postKeys.detail(id!),
        queryFn: () => getPost(id!),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });
}

// 게시글 생성
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation<PostResponse, AxiosError, CreatePostRequest>({
        mutationFn: createPost,
        onSuccess: () => {
            // 게시글 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "게시글 등록 중 오류가 발생했습니다.";
            // toast는 컴포넌트에서 처리하도록 함
            console.error("게시글 생성 오류:", errorMessage);
        },
    });
}

interface UpdatePostVariables {
    id: number;
    data: UpdatePostRequest;
}

// 게시글 수정
export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation<PostResponse, AxiosError, UpdatePostVariables>({
        mutationFn: ({ id, data }) => updatePost(id, data),
        onSuccess: (_data, variables) => {
            // 해당 게시글 상세 캐시 업데이트
            queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
            // 게시글 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

// 게시글 삭제
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean }, AxiosError, number>({
        mutationFn: deletePost,
        onSuccess: () => {
            // 게시글 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "게시글 삭제 중 오류가 발생했습니다.";
            console.error("게시글 삭제 오류:", errorMessage);
        },
    });
}

interface VerifyPasswordVariables {
    postId: number;
    password: string;
}

// 비밀글 비밀번호 확인
export function useVerifyPostPassword() {
    const queryClient = useQueryClient();

    return useMutation<VerifyPasswordResponse, AxiosError, VerifyPasswordVariables>({
        mutationFn: ({ postId, password }) => verifyPostPassword(postId, password),
        onSuccess: (_data, variables) => {
            // 비밀번호 확인 후 해당 게시글 상세 캐시 무효화하여 다시 로드
            queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
        },
        onError: (error) => {
            // 비밀번호 오류는 정상적인 사용자 입력 검증 오류이므로 콘솔 로그 출력하지 않음
            const axiosError = error as AxiosError;
            // 400 에러(비밀번호 오류)가 아닌 경우에만 로그 출력
            if (axiosError.response?.status !== 400) {
                const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "비밀번호 확인 중 오류가 발생했습니다.";
                console.error("비밀번호 확인 오류:", errorMessage);
            }
        },
    });
}

