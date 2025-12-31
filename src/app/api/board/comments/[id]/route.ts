import prisma from "../../../../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../lib/auth";
import { NextResponse } from "next/server";
import { commentSchema } from "../../../../../../lib/validation";
import { ZodError } from "zod";

interface RouteParams {
    params: Promise<{ id: string }>;
}

interface UpdateCommentRequest {
    content: string;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "로그인 필요" }, {
            status: 401,
        });
    }

    const { id } = await params;

    const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        select: { author_id: true, post_id: true },
    });

    if (!comment) {
        return NextResponse.json({ message: "댓글 없음" }, {
            status: 404,
        });
    }

    const post = await prisma.board.findUnique({
        where: { id: comment.post_id },
        select: { author_id: true },
    });

    if (!post) {
        return NextResponse.json(
            { message: "잘못된 게시물입니다." },
            {
                status: 404,
            }
        );
    }

    const isCommentOwner = session.user.id === comment.author_id;
    const isPostOwner = session.user.id === post.author_id;
    const isAdmin = session.user.role === "admin";

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
        return NextResponse.json({ message: "권한이 없습니다." }, {
            status: 403,
        });
    }

    try {
        await prisma.comment.update({
            where: { id: Number(id) },
            data: { is_deleted: true },
        });

        revalidatePath(`/board/${comment.post_id}`);

        return NextResponse.json({ message: "삭제 성공" }, {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "삭제 실패" }, {
            status: 500,
        });
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "로그인 필요" }, {
            status: 401,
        });
    }

    const { id } = await params;

    try {
        const body = await request.json() as UpdateCommentRequest;
        
        // 유효성 검사
        commentSchema.parse({ postId: Number(id), content: body.content });

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
            select: { author_id: true, post_id: true },
        });

        if (!comment) {
            return NextResponse.json({ message: "댓글 없음" }, {
                status: 404,
            });
        }

        const isCommentOwner = session.user.id === comment.author_id;
        const isAdmin = session.user.role === "admin";

        if (!isCommentOwner && !isAdmin) {
            return NextResponse.json({ message: "권한이 없습니다." }, {
                status: 403,
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content: body.content },
            include: {
                author: true,
            },
        });

        revalidatePath(`/board/${comment.post_id}`);

        return NextResponse.json({ comment: updatedComment }, {
            status: 200,
        });
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

        console.error(error);
        return NextResponse.json({ message: "수정 실패" }, {
            status: 500,
        });
    }
}

