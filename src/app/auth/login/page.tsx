"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema } from "../../../../lib/validation";
import ValidatedInput from "@/app/components/common/validated-input";
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

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }
            if (result?.ok) {
                toast.success("로그인 성공", {
                    description: "환영합니다!",
                });
                router.push("/");
            }
        } catch (err) {
            toast.error("로그인 실패");
        }
    };

    return (
        <div className="flex items-center justify-center px-4 pt-16 pb-12 bg-gradient-to-br from-stone-50 via-white to-stone-50">
            <Card className="w-full max-w-md shadow-xl border-stone-200 bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-stone-900">
                        로그인
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                        Portfolio Project에 오신 것을 환영합니다
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
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
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base"
                        >
                            {isSubmitting ? "로그인 중..." : "로그인하기"}
                        </Button>
                        <div className="text-center text-sm text-stone-600">
                            계정이 없으신가요?{" "}
                            <Link
                                href="/auth/signup"
                                className="text-stone-900 font-semibold hover:underline"
                            >
                                회원가입
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
