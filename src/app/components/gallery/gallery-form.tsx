"use client";

import { useState, useEffect } from "react";
import ImagePicker from "./image-picker";

const categories = ["음식", "여행", "일상"] as const;

interface GalleryFormData {
    title: string;
    content: string;
    category: string;
    files: File[];
    imageUrls: string[];
}

interface GalleryFormProps {
    initialData?: {
        title?: string;
        content?: string;
        category?: string;
        images?: string[];
    } | null;
    onSubmitHandler: (data: GalleryFormData) => Promise<void>;
    onCancel?: () => void;
    submitButtonText?: string;
}

export default function GalleryForm({ initialData = null, onSubmitHandler, onCancel, submitButtonText = "등록하기" }: GalleryFormProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<GalleryFormData>({
        title: "",
        content: "",
        category: categories[0],
        files: [],
        imageUrls: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title || "",
                content: initialData.content || "",
                category: initialData.category || categories[0],
                imageUrls: Array.isArray(initialData.images) ? initialData.images : [],
                files: [],
            }));
        }
    }, [initialData]);

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function addFiles(newFiles: File[]) {
        setFormData(prev => {
            const existing = prev.files;
            const filteredNew = newFiles.filter(
                nf =>
                    !existing.some(
                        ef =>
                            ef.name === nf.name &&
                            ef.size === nf.size &&
                            ef.lastModified === nf.lastModified
                    )
            );
            return { ...prev, files: [...existing, ...filteredNew] };
        });
    }

    function replaceFiles(newFiles: File[]) {
        setFormData(prev => ({
            ...prev,
            files: Array.isArray(newFiles) ? newFiles : [],
        }));
    }

    function removeUrl(index: number) {
        setFormData(prev => {
            const newUrls = [...prev.imageUrls];
            newUrls.splice(index, 1);
            return { ...prev, imageUrls: newUrls };
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // 이미 제출 중이면 무시
        if (isSubmitting) {
            return;
        }

        if (formData.imageUrls.length + formData.files.length === 0) {
            setMessage("이미지를 1장 이상 선택해주세요.");
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            await onSubmitHandler(formData);
            setMessage("완료되었습니다.");
        } catch (error) {
            setMessage("문제가 발생했습니다.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                >
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="제목을 입력하세요"
                />
            </div>

            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium mb-1"
                >
                    내용
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={onChange}
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="내용을 입력하세요"
                />
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                >
                    분류
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    className="w-full border-b border-gray-300 rounded-md p-2 focus:outline-none focus:ring-0 focus:ring-indigo-500"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <ImagePicker
                files={formData.files}
                imageUrls={formData.imageUrls}
                addFiles={addFiles}
                replaceFiles={replaceFiles}
                removeUrl={removeUrl}
            />

            {message && (
                <p
                    className={`font-semibold ${
                        message.includes("완료")
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}

            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1 text-gray-700 shadow font-bold py-3 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        취소
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${onCancel ? "flex-1" : "w-full"} text-white shadow font-bold py-3 rounded-md bg-gray-600 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isSubmitting ? "처리 중..." : submitButtonText}
                </button>
            </div>
        </form>
    );
}


