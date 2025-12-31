"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordModal from "../common/passwordModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BoardWithAuthor } from "@/lib/types/api.types";

interface PostListProps {
    posts: BoardWithAuthor[];
    totalCount: number;
    currentPage: number;
    perPage: number;
}

export default function PostList({ posts, totalCount, currentPage, perPage }: PostListProps) {
    const router = useRouter();
    const [modalPostId, setModalPostId] = useState<number | null>(null);

    function handleClick(post: BoardWithAuthor & { canBypass?: boolean }) {
        if (post.is_secret && !post.canBypass) {
            setModalPostId(post.id);
            return;
        }

        router.push(`/board/${post.id}`);
    }

    function closeModal() {
        setModalPostId(null);
    }

    function onPasswordSuccess() {
        if (modalPostId) {
            closeModal();
            router.push(`/board/${modalPostId}`);
        }
    }

    if (!posts || posts.length === 0)
        return (
            <div className="py-16 text-center">
                <p className="text-stone-500 text-lg">게시글이 없습니다.</p>
                <p className="text-stone-400 text-sm mt-2">
                    첫 번째 게시글을 작성해보세요.
                </p>
            </div>
        );

    return (
        <>
            <div className="space-y-2">
                {posts.map((post, idx) => (
                    <Card
                        key={post.id}
                        className={cn(
                            "transition-all duration-200 cursor-pointer hover:shadow-md hover:border-stone-300",
                            "border-l-4",
                            post.is_secret
                                ? "border-l-stone-400"
                                : "border-l-stone-200"
                        )}
                        onClick={() => handleClick(post)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ")
                                handleClick(post);
                        }}
                        aria-label={`게시글 ${post.title}`}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 text-center">
                                    <span className="text-stone-500 font-medium text-sm">
                                        {totalCount -
                                            ((currentPage - 1) * perPage + idx)}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-stone-900 truncate">
                                            {post.title}
                                        </h4>
                                        {post.is_secret && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                <span className="mr-1">🔒</span>
                                                비밀글
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-stone-600 truncate">
                                        {post.is_secret
                                            ? "비밀 글입니다."
                                            : post.content}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 text-right space-y-1">
                                    <div className="text-sm font-medium text-stone-900">
                                        {post.author?.nickname || post.author?.name || "익명"}
                                    </div>
                                    <div className="text-xs text-stone-500">
                                        {post.created_at
                                            ? new Date(
                                                  post.created_at instanceof Date
                                                      ? post.created_at
                                                      : post.created_at
                                              ).toLocaleDateString("ko-KR", {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                              })
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {modalPostId && (
                <PasswordModal
                    postId={modalPostId}
                    onClose={closeModal}
                    onSuccess={onPasswordSuccess}
                />
            )}
        </>
    );
}


