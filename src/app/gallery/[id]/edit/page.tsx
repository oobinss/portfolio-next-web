import prisma from "../../../../../lib/prisma";
import EditFormClient from "./edit-form-client";
import { toCloudFrontUrl } from "../../../../../lib/gallery";
import Link from "next/link";

export async function generateStaticParams() {
    const galleries = await prisma.gallery.findMany({
        select: { id: true },
    });
    return galleries.map(gallery => ({
        id: gallery.id.toString(),
    }));
}

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
    const { id } = await params;
    const gallery = await prisma.gallery.findUnique({
        where: { id: Number(id) },
    });

    if (!gallery) {
        return (
            <p className="text-center mt-20 text-xl text-gray-500">
                갤러리를 찾을 수 없습니다.
            </p>
        );
    }

    // 서버에서 이미지 URL 변환 (상세 페이지와 동일한 방식)
    const images = Array.isArray(gallery.images)
        ? (gallery.images as string[])
              .map(img => {
                  if (
                      !img ||
                      typeof img !== "string" ||
                      img.trim().length === 0
                  ) {
                      return null;
                  }
                  // 파일명만 추출 (uploads 경로 제거)
                  const file = img.split("/").pop();
                  if (!file) return null;
                  // 파일명만으로 CloudFront URL 생성 (uploads 경로 없이)
                  const imgUrl = toCloudFrontUrl(file);
                  return imgUrl;
              })
              .filter((url): url is string => {
                  return (
                      url !== null &&
                      url !== undefined &&
                      url.trim().length > 0 &&
                      (url.startsWith("http://") || url.startsWith("https://"))
                  );
              })
        : [];

    return (
        <main className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <Link
                    href={`/gallery/${gallery.id}`}
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
                    aria-label={`${gallery.title} 갤러리 상세 페이지로 돌아가기`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                    상세페이지로
                </Link>
                <h1 className="text-2xl font-bold">사진 및 내용 수정</h1>
            </div>
            <EditFormClient gallery={gallery} processedImages={images} />
        </main>
    );
}
