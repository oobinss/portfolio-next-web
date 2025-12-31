import prisma from "../../../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ postId: string }>;
}

interface VerifyPasswordRequest {
    password: string;
}

export async function POST(request: Request, { params }: RouteParams) {
    const { postId } = await params;
    const body = await request.json() as VerifyPasswordRequest;
    const { password } = body;

    const post = await prisma.board.findUnique({
        where: { id: Number(postId) },
        select: { password_hash: true, is_secret: true },
    });

    if (!post) {
        return NextResponse.json(
            { error: "게시글을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    const cookieStore = await cookies();

    if (!post.is_secret) {
        cookieStore.set(`board_access_${postId}`, "1", {
            httpOnly: true,
            maxAge: 60 * 60, // 1시간
            path: `/board/${postId}`,
        });

        return NextResponse.json({ success: true }, {
            status: 200,
        });
    }

    if (!post.password_hash) {
        return NextResponse.json(
            { error: "비밀번호가 설정되지 않았습니다." },
            { status: 400 }
        );
    }

    const isMatch = await bcrypt.compare(password, post.password_hash);
    if (!isMatch) {
        return NextResponse.json(
            { error: "비밀번호가 올바르지 않습니다." },
            { status: 400 } // 401 대신 400 사용 (비밀번호 오류는 검증 오류이므로)
        );
    }

    cookieStore.set(`board_access_${postId}`, "1", {
        httpOnly: true,
        maxAge: 60 * 60, // 1시간
        path: "/board", // 모든 게시글 페이지에서 접근 가능하도록 path 변경
    });

    return NextResponse.json({ success: true }, {
        status: 200,
    });
}

