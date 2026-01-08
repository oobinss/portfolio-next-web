"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    useDeleteComment,
    useDeletePost,
    useDeleteGalleryItem,
} from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/lib/hooks/usePosts";

interface DeleteButtonProps {
    apiPath?: string;
    redirectPath?: string;
    variant?: "comment" | "default";
    commentId?: number;
    postId?: number;
    galleryId?: number;
}

export default function DeleteButton({
    apiPath,
    redirectPath,
    variant,
    commentId,
    postId,
    galleryId,
}: DeleteButtonProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 댓글 삭제인지 게시글 삭제인지 갤러리 삭제인지 확인
    const isComment = apiPath?.includes("/comments/") || false;
    const isGallery = apiPath?.includes("/gallery/") || false;
    const deleteComment = useDeleteComment();
    const deletePost = useDeletePost();
    const deleteGalleryItem = useDeleteGalleryItem();

    const handleDelete = async () => {
        // 확인 다이얼로그
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {
            if (isComment && commentId) {
                deleteComment.mutate(commentId, {
                    onSuccess: () => {
                        toast.success("삭제 완료", {
                            description: "댓글이 삭제되었습니다.",
                        });
                        queryClient.invalidateQueries({
                            queryKey: postKeys.details(),
                        });
                        // 서버 컴포넌트를 다시 렌더링하여 댓글 목록 갱신
                        router.refresh();
                    },
                    onError: () => {
                        toast.error("삭제 실패");
                    },
                });
            } else if (postId) {
                deletePost.mutate(postId, {
                    onSuccess: () => {
                        toast.success("삭제 완료", {
                            description: "게시글이 삭제되었습니다.",
                        });
                        if (redirectPath) {
                            router.push(redirectPath);
                        } else {
                            router.refresh();
                        }
                    },
                    onError: () => {
                        toast.error("삭제 실패");
                    },
                });
            } else if (isGallery && galleryId) {
                deleteGalleryItem.mutate(galleryId, {
                    onSuccess: () => {
                        toast.success("삭제 완료", {
                            description: "갤러리 항목이 삭제되었습니다.",
                        });
                        if (redirectPath) {
                            router.push(redirectPath);
                        } else {
                            router.refresh();
                        }
                    },
                    onError: () => {
                        toast.error("삭제 실패");
                    },
                });
            } else if (apiPath) {
                // 기존 방식 (fallback)
                const res = await fetch(apiPath, { method: "DELETE" });
                if (res.ok) {
                    toast.success("삭제 완료", {
                        description: "성공적으로 삭제되었습니다.",
                    });
                    if (redirectPath) {
                        router.push(redirectPath);
                    } else {
                        router.refresh();
                    }
                } else {
                    toast.error("삭제 실패");
                }
            }
        } catch (error) {
            toast.error("삭제 실패");
        }
    };

    const baseClass =
        variant === "comment"
            ? "w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 transition-colors"
            : "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium";

    const isLoading =
        (isComment && deleteComment.isPending) ||
        (postId && deletePost.isPending) ||
        (isGallery && deleteGalleryItem.isPending);

    const ariaLabel =
        variant === "comment"
            ? "댓글 삭제"
            : postId
            ? "게시글 삭제"
            : galleryId
            ? "갤러리 항목 삭제"
            : "삭제";

    return (
        <button
            onClick={handleDelete}
            className={baseClass}
            disabled={isLoading}
            aria-label={ariaLabel}
            aria-busy={isLoading}
        >
            {isLoading ? "삭제 중..." : "삭제"}
        </button>
    );
}
