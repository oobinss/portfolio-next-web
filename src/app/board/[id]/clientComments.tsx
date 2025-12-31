"use client";
import CommentItem from "@/app/components/board/commentItem";
import type { CommentWithAuthor } from "@/lib/types/api.types";

interface ClientCommentsProps {
    comments: (CommentWithAuthor & { isCommentOwner?: boolean })[];
    isOwner: boolean;
    isAdmin: boolean;
}

export default function ClientComments({ comments, isOwner, isAdmin }: ClientCommentsProps) {
    if (!comments || comments.length === 0) return <p>댓글이 없습니다.</p>;
    return (
        <ul>
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    isOwnerOrAdmin={
                        comment.isCommentOwner || isOwner || isAdmin
                    }
                />
            ))}
        </ul>
    );
}


