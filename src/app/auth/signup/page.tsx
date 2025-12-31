"use client";

import ValidatedInput from "@/app/components/common/validated-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../../../lib/validation";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import type { z } from "zod";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json() as { message?: string };
                throw new Error(errorData.message || "회원가입 실패");
            }

            toast.success("회원가입 완료", {
                description: "회원가입이 성공적으로 완료되었습니다.",
            });
            router.push("/auth/login");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
            toast.error("회원가입 실패", {
                description: errorMessage,
            });
        }
    };

    return (
        <div className="flex items-center justify-center px-4 pt-16 pb-12 bg-gradient-to-br from-stone-50 via-white to-stone-50">
            <Card className="w-full max-w-lg shadow-xl border-stone-200 bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-stone-900">
                        회원가입
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                        Portfolio Project 회원이 되어 다양한 서비스를 이용해보세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        <ValidatedInput
                            label="이메일"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            error={errors.email}
                            registerReturn={register("email")}
                        />
                        <ValidatedInput
                            label="비밀번호"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            error={errors.password}
                            registerReturn={register("password")}
                            helperText="영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요."
                        />
                        <ValidatedInput
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            error={errors.passwordConfirm}
                            registerReturn={register("passwordConfirm")}
                        />
                        <ValidatedInput
                            label="이름"
                            type="text"
                            placeholder="이름을 입력하세요"
                            error={errors.name}
                            registerReturn={register("name")}
                        />
                        <ValidatedInput
                            label="닉네임"
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            error={errors.nickname}
                            registerReturn={register("nickname")}
                            helperText="2~20자 영문, 숫자, 한글 가능"
                        />
                        <ValidatedInput
                            label="휴대폰 번호"
                            type="tel"
                            placeholder="- 없이 숫자만 입력"
                            error={errors.phone}
                            registerReturn={register("phone")}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base mt-6"
                        >
                            {isSubmitting ? "가입 중..." : "회원가입하기"}
                        </Button>
                        <div className="text-center text-sm text-stone-600">
                            이미 계정이 있으신가요?{" "}
                            <Link
                                href="/auth/login"
                                className="text-stone-900 font-semibold hover:underline"
                            >
                                로그인
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


