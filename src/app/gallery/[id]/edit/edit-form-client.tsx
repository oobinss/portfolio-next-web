"use client";

import { useRouter } from "next/navigation";
import GalleryForm from "@/app/components/gallery/gallery-form";
import type { Gallery } from "../../../../../src/generated/prisma";

interface EditFormClientProps {
    gallery: Gallery;
    processedImages: string[];
}

export default function EditFormClient({ gallery, processedImages }: EditFormClientProps) {
    const router = useRouter();

    function handleCancel() {
        router.push(`/gallery/${gallery.id}`);
    }

    async function handleUpdate(formData: {
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
            // CloudFront URL에서 파일명만 추출하여 전달
            const fileName = url.split("/").pop() || url;
            data.append("imageUrls", fileName);
        });

        (formData.files ?? []).forEach(file => {
            data.append("images", file);
        });

        const res = await fetch(`/api/gallery/${gallery.id}`, {
            method: "PUT",
            body: data,
        });

        const result = await res.json() as { error?: string; success?: boolean };
        if (!res.ok || result.error) {
            throw new Error(result.error || "수정 실패");
        }

        router.push(`/gallery/${gallery.id}`);
    }

    return (
        <GalleryForm
            initialData={{
                title: gallery.title,
                content: typeof gallery.content === "string" ? gallery.content : "",
                category: gallery.category || undefined,
                images: processedImages,
            }}
            onSubmitHandler={handleUpdate}
            onCancel={handleCancel}
            submitButtonText="수정하기"
        />
    );
}


