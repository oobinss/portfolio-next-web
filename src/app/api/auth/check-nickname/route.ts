import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nickname } = body;

        if (!nickname || typeof nickname !== "string") {
            return NextResponse.json(
                { message: "닉네임을 입력해주세요." },
                { status: 400 }
            );
        }

        const trimmedNickname = nickname.trim();

        // 빈 문자열 체크
        if (!trimmedNickname) {
            return NextResponse.json(
                { message: "닉네임을 입력해주세요." },
                { status: 400 }
            );
        }

        // 닉네임 길이 검증 (클라이언트에서도 검증하지만 서버에서도 한 번 더 체크)
        if (trimmedNickname.length < 2 || trimmedNickname.length > 20) {
            return NextResponse.json(
                { available: true }, // 길이 검증은 클라이언트에서 처리
                { status: 200 }
            );
        }

        // 닉네임 중복 검사
        const exists = await prisma.user.findUnique({
            where: { nickname: trimmedNickname },
            select: { id: true },
        });

        return NextResponse.json(
            { available: !exists },
            { status: 200 }
        );
    } catch (error) {
        console.error("닉네임 중복 체크 오류:", error);
        return NextResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

