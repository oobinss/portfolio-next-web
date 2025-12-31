import { NextResponse } from "next/server";
import { commentSchema } from "../../../../../lib/validation";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { ZodError } from "zod";

interface CreateCommentRequest {
    postId: number;
    content: string;
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "로그인이 필요합니다." },
                { status: 401 }
            );
        }

        const body = await request.json() as CreateCommentRequest;
        // 유효성 검사
        commentSchema.parse(body);

        // 댓글 생성
        const newComment = await prisma.comment.create({
            data: {
                post_id: body.postId,
                content: body.content,
                author_id: session.user.id,
            },
        });

        return NextResponse.json({ comment: newComment }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError && error.issues) {
            const issues = error.issues.map(e => ({
                path: e.path.join("."),
                message: e.message,
            }));

            return NextResponse.json(
                { error: "Validation Error", issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}


