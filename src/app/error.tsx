"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <>
            <div className="relative w-full h-[450px] bg-black flex items-center justify-center">
                <Image
                    src="/main-image.jpg"
                    alt="에러 페이지 배너"
                    width={1200}
                    height={400}
                    priority
                    className="object-cover w-full h-full shadow-md"
                />
            </div>

            <main className="max-w-5xl mx-auto py-14 px-6">
                <Card className="shadow-lg border-stone-200 bg-white">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle
                                className="h-12 w-12 text-red-500"
                                aria-hidden="true"
                            />
                        </div>
                        <CardTitle className="text-2xl font-semibold text-stone-900">
                            오류가 발생했습니다
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className="space-y-2">
                            <p className="text-stone-700">
                                예상치 못한 오류가 발생했습니다.
                            </p>
                            <p className="text-sm text-stone-600">
                                잠시 후 다시 시도하거나, 문제가 지속될 경우
                                관리자에게 문의하세요.
                            </p>
                            {process.env.NODE_ENV === "development" &&
                                error.message && (
                                    <details className="mt-4 text-left">
                                        <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-700">
                                            오류 상세 정보 (개발 모드)
                                        </summary>
                                        <pre className="mt-2 p-4 bg-stone-50 rounded text-xs overflow-auto max-h-40">
                                            {error.message}
                                            {error.stack &&
                                                `\n\n${error.stack}`}
                                        </pre>
                                    </details>
                                )}
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => reset()}
                                variant="default"
                                size="lg"
                                aria-label="페이지 다시 시도"
                            >
                                다시 시도하기
                            </Button>
                            <Button
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                                variant="outline"
                                size="lg"
                                aria-label="홈으로 이동"
                            >
                                홈으로 이동
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
