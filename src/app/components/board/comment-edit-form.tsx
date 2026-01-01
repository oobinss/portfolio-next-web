"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateComment } from "@/lib/hooks/useComments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { CommentWithAuthor } from "@/lib/types/api.types";

interface CommentEditFormProps {
    comment: CommentWithAuthor;
    onCancel: () => void;
    onSuccess?: () => void;
}

export default function CommentEditForm({
    comment,
    onCancel,
    onSuccess,
}: CommentEditFormProps) {
    const router = useRouter();
    const [content, setContent] = useState(comment.content);
    const updateComment = useUpdateComment();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("입력 오류", {
                description: "댓글 내용을 입력해주세요.",
            });
            return;
        }

        updateComment.mutate(
            { commentId: comment.id, data: { content: content.trim() } },
            {
                onSuccess: () => {
                    toast.success("수정 완료", {
                        description: "댓글이 성공적으로 수정되었습니다.",
                    });
                    // 서버 컴포넌트를 다시 렌더링하여 댓글 목록 갱신
                    router.refresh();
                    onSuccess?.();
                },
                onError: () => {
                    toast.error("수정 실패");
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <label htmlFor="comment-edit-input" className="sr-only">
                댓글 수정
            </label>
            <Textarea
                id="comment-edit-input"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                disabled={updateComment.isPending}
                className="min-h-[80px] mb-2"
                autoFocus
                aria-label="댓글 내용 수정"
            />
            <div className="flex gap-2 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    disabled={updateComment.isPending}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    size="sm"
                    disabled={updateComment.isPending || !content.trim()}
                >
                    {updateComment.isPending ? "수정 중..." : "수정"}
                </Button>
            </div>
        </form>
    );
}
