"use client";

import { useState, useRef, useEffect } from "react";
import DeleteButton from "../common/delete-button";
import CommentEditForm from "./comment-edit-form";
import { Card } from "@/components/ui/card";
import type { CommentWithAuthor } from "@/lib/types/api.types";

interface CommentItemProps {
    comment: CommentWithAuthor;
    isOwnerOrAdmin: boolean;
}

export default function CommentItem({ comment, isOwnerOrAdmin }: CommentItemProps) {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === "Escape" && open) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [open]);

    const handleEdit = () => {
        setIsEditing(true);
        setOpen(false);
    };

    const handleEditSuccess = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const createdAt = comment.created_at
        ? new Date(
              comment.created_at instanceof Date
                  ? comment.created_at
                  : comment.created_at
          )
        : new Date();
    const formattedDate =
        new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
            .format(createdAt)
            .replace(/\. /g, ".") + ". ";

    return (
        <li className="mb-4">
            <Card className="p-4 bg-stone-50 border-stone-200">
                <div className="flex justify-between mb-2">
                    <p className="font-semibold text-stone-900">
                        {comment.author?.nickname ||
                            comment.author?.name ||
                            "익명"}
                    </p>
                    {isOwnerOrAdmin && !isEditing && (
                        <div className="relative" ref={menuRef}>
                            <button
                                className="px-2 py-1 rounded-full hover:bg-stone-200 text-xl text-stone-600 transition-colors"
                                onClick={() => setOpen(v => !v)}
                                type="button"
                                aria-label="더보기"
                            >
                                &#x22EE;
                            </button>
                            {open && (
                                <div
                                    className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md border border-stone-200 text-sm z-10 overflow-hidden"
                                    role="menu"
                                    aria-label="댓글 메뉴"
                                >
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 transition-colors focus-visible:outline-none focus-visible:bg-stone-50"
                                        onClick={handleEdit}
                                        role="menuitem"
                                        aria-label="댓글 수정"
                                    >
                                        수정
                                    </button>
                                    <DeleteButton
                                        apiPath={`/api/board/comments/${comment.id}`}
                                        variant="comment"
                                        commentId={comment.id}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <CommentEditForm
                        comment={comment}
                        onCancel={handleCancel}
                        onSuccess={handleEditSuccess}
                    />
                ) : (
                    <>
                        <p className="text-stone-700 mb-2 whitespace-pre-wrap">
                            {comment.content}
                        </p>
                        <div className="text-xs text-stone-500">
                            {formattedDate}
                        </div>
                    </>
                )}
            </Card>
        </li>
    );
}


