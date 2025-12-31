"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImagePickerProps {
    files: File[];
    imageUrls?: string[];
    addFiles: (files: File[]) => void;
    replaceFiles: (files: File[]) => void;
    removeUrl: (index: number) => void;
}

export default function ImagePicker({
    files,
    imageUrls = [],
    addFiles,
    replaceFiles,
    removeUrl,
}: ImagePickerProps) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // files가 배열이고 File 객체들만 필터링
        const fileArr = Array.isArray(files)
            ? files.filter(f => f instanceof File)
            : [];

        // 새로운 URL들 생성
        const urls = fileArr.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        // 컴포넌트 언마운트 시 메모리 해제
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(e.target.files || []).filter(
            f => f instanceof File
        );
        if (selectedFiles.length > 0) {
            addFiles(selectedFiles); // 파일 추가
        }
        if (e.target) {
            e.target.value = ""; // 동일 파일 재선택을 위해 필요
        }
    }

    function handleRemove(index: number) {
        const newFiles = files.filter((_, i) => i !== index);
        replaceFiles(newFiles); // 파일 교체
    }

    function openFilePicker() {
        fileInputRef.current?.click();
    }

    return (
        <div>
            <label htmlFor="images" className="block text-sm font-medium mb-1">
                사진
            </label>
            <input
                ref={fileInputRef}
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={handleChange}
                multiple
                className="hidden block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
            />

            <button
                type="button"
                onClick={openFilePicker}
                className="bg-blue-900 text-white text-sm px-4 py-2 rounded-md font-semibold hover:bg-gray-500 transition-colors"
            >
                사진 선택
            </button>

            {/* 파일명 목록 표시 */}
            {files.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                    {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                    ))}
                </ul>
            )}
            {(imageUrls.length > 0 || previewUrls.length > 0) && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {/* 기존 이미지 URL 렌더링 */}
                    {imageUrls
                        .filter((url): url is string => {
                            // 유효한 URL인지 확인
                            if (
                                !url ||
                                typeof url !== "string" ||
                                url.trim().length === 0
                            ) {
                                return false;
                            }
                            // http:// 또는 https://로 시작하는지 확인
                            return (
                                url.startsWith("http://") ||
                                url.startsWith("https://")
                            );
                        })
                        .map((url, i) => (
                            <div
                                key={`url-${i}`}
                                className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-300 bg-gray-100"
                            >
                                <Image
                                    src={url}
                                    alt={`existing-${i}`}
                                    fill
                                    className="object-cover"
                                    sizes="160px"
                                    //unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() => removeUrl(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors z-10"
                                    aria-label="기존 이미지 삭제"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                    {/* 새로 선택된 파일 프리뷰 렌더링 */}
                    {previewUrls.map((src, i) => (
                        <div
                            key={`preview-${i}`}
                            className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-300"
                        >
                            <Image
                                src={src}
                                alt={`preview-${i}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(i)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                                aria-label="새 이미지 삭제"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
