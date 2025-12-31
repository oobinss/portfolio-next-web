"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boardPostSchema } from "../../../../lib/validation";
import { toast } from "sonner";
import type { z } from "zod";

type BoardPostFormData = z.infer<typeof boardPostSchema>;

export default function NewBoardForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BoardPostFormData>({
        resolver: zodResolver(boardPostSchema),
        defaultValues: {
            title: "",
            content: "",
            isSecret: false,
            password: "",
        },
    });

    const isSecret = watch("isSecret");

    const onSubmit = async (data: BoardPostFormData) => {
        try {
            const res = await fetch("/api/board", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const result = await res.json() as { error?: string; message?: string };
                const msg =
                    result.error ||
                    result.message ||
                    "서버 에러가 발생했습니다.";
                if (res.status === 401) {
                    toast.error("인증 필요", {
                        description: result.error || "로그인이 필요합니다.",
                    });
                    router.push(
                        `/auth/login?redirect=${encodeURIComponent(
                            window.location.pathname
                        )}`
                    );
                    return;
                }
                throw new Error(msg);
            }

            toast.success("게시글 등록 완료", {
                description: "게시글이 성공적으로 등록되었습니다.",
            });
            router.push("/board");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
            toast.error("등록 실패", {
                description: errorMessage,
            });
        }
    };

    return (
        <main className="flex justify-center items-start min-h-screen bg-gray-100 py-12">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <Link
                        href="/board"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                        목록으로
                    </Link>
                    <h1 className="text-2xl font-bold">글쓰기</h1>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                >
                    <div>
                        <label
                            htmlFor="title"
                            className="block mb-1 font-semibold"
                        >
                            제목
                        </label>
                        <input
                            id="title"
                            type="text"
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                errors.title
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-400"
                            }`}
                            placeholder="제목을 입력하세요"
                            {...register("title")}
                            disabled={isSubmitting}
                            autoComplete="off"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="block mb-1 font-semibold"
                        >
                            글 내용
                        </label>
                        <textarea
                            id="content"
                            rows={6}
                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 resize-none ${
                                errors.content
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-400"
                            }`}
                            placeholder="내용을 입력하세요"
                            {...register("content")}
                            disabled={isSubmitting}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="isSecret"
                            type="checkbox"
                            {...register("isSecret")}
                            disabled={isSubmitting}
                        />
                        <label
                            htmlFor="isSecret"
                            className="font-semibold select-none"
                        >
                            비밀글로 설정
                        </label>
                    </div>
                    {isSecret && (
                        <div className="flex flex-col mt-4 w-full max-w-xs">
                            <label
                                htmlFor="password"
                                className="mb-2 text-sm font-semibold text-gray-700"
                            >
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`w-full rounded-md border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none transition ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-400 focus:ring-2"
                                }`}
                                placeholder="비밀번호를 입력하세요"
                                {...register("password")}
                                disabled={isSubmitting}
                                autoComplete="new-password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-800 shadow transition-all text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "등록 중..." : "등록"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}


