"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment, deleteComment } from "../api/board";
import { postKeys } from "./usePosts";
import { toast } from "sonner";
import type {
    CreateCommentRequest,
    UpdateCommentRequest,
    CommentResponse,
} from "../types/api.types";
import type { AxiosError } from "axios";

interface CreateCommentVariables {
    postId: number;
    data: CreateCommentRequest;
}

// 댓글 생성
export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation<CommentResponse, AxiosError, CreateCommentVariables>({
        mutationFn: ({ postId, data }) => createComment(postId, data),
        onSuccess: (_data, variables) => {
            // 해당 게시글 상세 캐시 무효화하여 댓글 목록 갱신
            queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "댓글 등록 중 오류가 발생했습니다.";
            toast.error("댓글 등록 실패", {
                description: errorMessage,
            });
        },
    });
}

interface UpdateCommentVariables {
    commentId: number;
    data: UpdateCommentRequest;
}

// 댓글 수정
export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation<CommentResponse, AxiosError, UpdateCommentVariables>({
        mutationFn: ({ commentId, data }) => updateComment(commentId, data),
        onSuccess: () => {
            // 모든 게시글 상세 캐시 무효화 (댓글이 속한 게시글을 정확히 알 수 없으므로)
            queryClient.invalidateQueries({ queryKey: postKeys.details() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "댓글 수정 중 오류가 발생했습니다.";
            toast.error("댓글 수정 실패", {
                description: errorMessage,
            });
        },
    });
}

// 댓글 삭제
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean }, AxiosError, number>({
        mutationFn: deleteComment,
        onSuccess: () => {
            // 모든 게시글 상세 캐시 무효화 (댓글이 속한 게시글을 정확히 알 수 없으므로)
            queryClient.invalidateQueries({ queryKey: postKeys.details() });
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError & { userMessage?: string }).userMessage || "댓글 삭제 중 오류가 발생했습니다.";
            toast.error("댓글 삭제 실패", {
                description: errorMessage,
            });
        },
    });
}


