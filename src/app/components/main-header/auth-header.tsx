"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AuthHeaderProps {
    isMainPage?: boolean;
}

export default function AuthHeader({
    isMainPage: _isMainPage = true,
}: AuthHeaderProps) {
    const { data: session, status } = useSession();

    // 모든 페이지에서 메인 페이지와 동일한 색상 사용
    const textColor = "text-white/95";

    const buttonClass = "text-white/90 hover:text-white hover:bg-white/15";

    const signupButtonClass =
        "bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white border border-white/30";

    // 모든 페이지에서 작은 크기로 통일
    const paddingClass = "py-1.5";
    const textSizeClass = "text-xs";
    const buttonSizeClass = "h-7 px-2.5 text-xs";

    const containerClass = `flex justify-end items-center gap-2 px-4 sm:px-6 lg:px-8 ${paddingClass} text-sm`;

    return (
        <div className={containerClass}>
            {status === "authenticated" ? (
                <>
                    <span
                        className={`${textColor} font-medium ${textSizeClass}`}
                    >
                        안녕하세요,{" "}
                        <span className="font-semibold">
                            {session?.user?.name || session?.user?.email}
                        </span>
                        님
                    </span>
                    <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        size="sm"
                        className={`${buttonClass} ${buttonSizeClass}`}
                        aria-label="로그아웃"
                    >
                        로그아웃
                    </Button>
                </>
            ) : (
                <>
                    <Link href="/auth/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${buttonClass} ${buttonSizeClass}`}
                            aria-label="로그인 페이지로 이동"
                        >
                            로그인
                        </Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button
                            variant="default"
                            size="sm"
                            className={`${signupButtonClass} ${buttonSizeClass} font-medium shadow-sm`}
                            aria-label="회원가입 페이지로 이동"
                        >
                            회원가입
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
}
