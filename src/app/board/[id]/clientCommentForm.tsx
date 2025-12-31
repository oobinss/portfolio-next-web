"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { commentSchema } from "../../../../lib/validation";
import { ZodError } from "zod";
import { useCreateComment } from "@/lib/hooks/useComments";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface ClientCommentFormProps {
    postId: number;
}

export default function ClientCommentForm({ postId }: ClientCommentFormProps) {
    const router = useRouter();
    const [content, setContent] = useState("");
    const createComment = useCreateComment();

    const isContentEmpty = content.trim() === "";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            commentSchema.parse({ postId, content });
        } catch (error) {
            if (error instanceof ZodError && error.issues) {
                toast.error("입력 오류", {
                    description:
                        error.issues[0]?.message ||
                        "입력값이 올바르지 않습니다.",
                });
                return;
            }
            toast.error("오류 발생", {
                description: "알 수 없는 오류가 발생했습니다.",
            });
            return;
        }

        createComment.mutate(
            { postId, data: { content } },
            {
                onSuccess: () => {
                    setContent("");
                    toast.success("댓글 등록 완료", {
                        description: "댓글이 성공적으로 등록되었습니다.",
                    });
                    // 서버 컴포넌트를 다시 렌더링하여 댓글 목록 갱신
                    router.refresh();
                },
                onError: (error) => {
                    const axiosError = error as AxiosError & { userMessage?: string };
                    const errorMessage = axiosError.userMessage || "댓글 등록에 실패했습니다. 다시 시도해주세요.";
                    toast.error("댓글 등록 실패", {
                        description: errorMessage,
                    });
                },
            }
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-2"
            aria-label="댓글 작성"
        >
            <label htmlFor="comment-input" className="sr-only">
                댓글 입력
            </label>
            <textarea
                id="comment-input"
                className="w-full p-2 border rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={createComment.isPending}
                aria-label="댓글 내용 입력"
                aria-describedby="comment-help"
            />
            <span id="comment-help" className="sr-only">
                댓글을 입력한 후 등록 버튼을 눌러주세요
            </span>
            <button
                type="submit"
                disabled={createComment.isPending || isContentEmpty}
                className={`self-end px-4 py-2 rounded border-none transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 ${
                    isContentEmpty
                        ? "bg-transparent text-[#b7b7b7] cursor-not-allowed"
                        : "bg-[rgba(3,199,90,0.12)] text-[#009f47] cursor-pointer hover:bg-[rgba(3,199,90,0.2)]"
                }`}
                aria-label="댓글 등록"
                aria-busy={createComment.isPending}
            >
                {createComment.isPending ? "등록 중..." : "등록"}
            </button>
        </form>
    );
}


