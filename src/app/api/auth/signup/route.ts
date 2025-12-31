import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { signUpSchema } from "../../../../../lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = signUpSchema.parse(body);

        const result = await prisma.$transaction(async (tx) => {
            // 이메일 중복 검사
            const exists = await tx.user.findUnique({
                where: { email: data.email },
                select: { id: true },
            });
            if (exists) {
                throw new Error("이미 사용 중인 이메일입니다.");
            }

            if (data.nickname) {
                const nicknameExists = await tx.user.findUnique({
                    where: { nickname: data.nickname },
                    select: { id: true },
                });
                if (nicknameExists) {
                    throw new Error("이미 사용 중인 닉네임입니다.");
                }
            }

            // 비밀번호 해싱
            const passwordHash = await bcrypt.hash(data.password, 10);

            // 사용자 저장
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password_hash: passwordHash,
                    name: data.name,
                    phone: data.phone || null,
                    nickname: data.nickname || null,
                },
                select: { id: true },
            });

            return user;
        });

        return NextResponse.json(
            { message: "회원가입 성공", userId: result.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message === "이미 사용 중인 이메일입니다." ||
                error.message === "이미 사용 중인 닉네임입니다."
            ) {
                return NextResponse.json(
                    { message: error.message },
                    { status: 409 }
                );
            }
        }
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "입력값 검증 실패", errors: error.issues },
                { status: 400 }
            );
        }
        console.error("회원가입 오류:", error);
        return NextResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}


