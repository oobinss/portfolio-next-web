import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { boardPostSchema } from "../../../../lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const SALT_ROUNDS = 10;

function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

async function hashPassword(password: string | null | undefined): Promise<string | null> {
    if (!password) return null;
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user)
            return errorResponse("글을 작성하려면 로그인을 하셔야합니다.", 401);
        const userId = session.user.id;
        const body = await request.json();

        const parsed = boardPostSchema.safeParse(body);
        if (!parsed.success) {
            const errorMessage =
                parsed.error.issues?.[0]?.message ??
                "입력값이 올바르지 않습니다.";
            return errorResponse(errorMessage);
        }

        const { title, content, isSecret = false, password } = parsed.data;
        const passwordHash = isSecret ? await hashPassword(password) : null;

        const post = await prisma.board.create({
            data: {
                title,
                content,
                author_id: userId,
                password_hash: passwordHash,
                is_secret: isSecret,
                is_deleted: false,
            },
        });

        if (!post) return errorResponse("게시글 저장에 실패했습니다.", 500);

        return NextResponse.json({ success: true, postId: post.id });
    } catch (error) {
        console.error("게시글 저장 오류:", error);
        return errorResponse("서버 오류가 발생했습니다.", 500);
    }
}


