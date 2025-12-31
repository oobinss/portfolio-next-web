"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import GalleryForm from "@/app/components/gallery/gallery-form";

export default function UploadPage() {
    const router = useRouter();

    async function handleUpload(formData: {
        title: string;
        content: string;
        category: string;
        files: File[];
        imageUrls: string[];
    }) {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("category", formData.category);

        (formData.imageUrls ?? []).forEach(url => {
            data.append("imageUrls", url);
        });

        (formData.files ?? []).forEach(file => {
            data.append("images", file);
        });
        const res = await fetch("/api/gallery", {
            method: "POST",
            body: data,
        });

        const result = await res.json() as { error?: string; success?: boolean };

        if (!res.ok || result.error) {
            throw new Error(result.error || "업로드 실패");
        }

        router.push("/gallery");
    }

    return (
        <main className="flex justify-center items-start min-h-screen bg-gray-100 py-12">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <Link
                        href="/gallery"
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
                    <h1 className="text-2xl font-bold">사진 및 내용 등록</h1>
                </div>
                <GalleryForm onSubmitHandler={handleUpload} />
            </div>
        </main>
    );
}


