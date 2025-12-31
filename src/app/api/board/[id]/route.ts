import { revalidatePath } from "next/cache";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { NextResponse } from "next/server";
import { boardPostSchema } from "../../../../../lib/validation";
import bcrypt from "bcrypt";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { message: "로그인 필요" },
            {
                status: 401,
            }
        );
    }
    const { id } = await params;

    const post = await prisma.board.findUnique({ where: { id: Number(id) } });

    if (!post) {
        return NextResponse.json(
            { message: "게시글 없음" },
            {
                status: 404,
            }
        );
    }
    const isOwner = session.user.id === post.author_id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return NextResponse.json(
            { message: "권한이 없습니다." },
            {
                status: 403,
            }
        );
    }

    try {
        await prisma.board.update({
            where: { id: Number(id) },
            data: { is_deleted: true },
        });

        revalidatePath("/board");
        return NextResponse.json(
            { message: "삭제 성공" },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "삭제 실패" },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "글을 수정하려면 로그인을 하셔야합니다." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const parsed = boardPostSchema.safeParse(body);
        if (!parsed.success) {
            const issues = parsed.error.issues.map(e => ({
                path: e.path.join("."),
                message: e.message,
            }));
            return NextResponse.json(
                { error: "Validation Error", issues },
                { status: 400 }
            );
        }

        const post = await prisma.board.findUnique({
            where: { id: Number(id) },
            select: { author_id: true },
        });

        if (!post) {
            return NextResponse.json(
                { error: "게시글을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const isOwner = session.user.id === post.author_id;
        const isAdmin = session.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "권한이 없습니다." },
                { status: 403 }
            );
        }

        const { title, content, isSecret = false, password } = parsed.data;

        // 기존 게시글 정보 가져오기 (비밀번호 해시 확인용)
        const existingPost = await prisma.board.findUnique({
            where: { id: Number(id) },
            select: { password_hash: true },
        });

        let passwordHash: string | null = null;
        if (isSecret) {
            if (password && password.trim().length > 0) {
                // 새 비밀번호가 제공된 경우 해시 생성
                passwordHash = await bcrypt.hash(password, 10);
            } else if (existingPost?.password_hash) {
                // 비밀번호가 제공되지 않았지만 기존 비밀번호가 있는 경우 유지
                passwordHash = existingPost.password_hash;
            }
        }

        await prisma.board.update({
            where: { id: Number(id) },
            data: {
                title,
                content,
                is_secret: isSecret,
                password_hash: passwordHash,
                updated_at: new Date(),
            },
        });

        revalidatePath(`/board/${id}`);
        revalidatePath("/board");

        // author 정보 포함하여 반환
        const postWithAuthor = await prisma.board.findUnique({
            where: { id: Number(id) },
            include: {
                author: true,
                comments: {
                    where: { is_deleted: false },
                    include: { author: true },
                },
            },
        });

        return NextResponse.json({ post: postWithAuthor });
    } catch (error) {
        console.error("게시글 수정 오류:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
