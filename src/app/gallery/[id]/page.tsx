import Image from "next/image";
import prisma from "../../../../lib/prisma";
import DeleteButton from "@/app/components/common/delete-button";
import Link from "next/link";
import { fetchGalleryDetail, toCloudFrontUrl } from "../../../../lib/gallery";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

interface GalleryDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: GalleryDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const gallery = await fetchGalleryDetail(Number(id));

    if (!gallery) {
        return {
            title: "사업분야를 찾을 수 없습니다 - Portfolio Project",
            description: "해당 사업분야 정보가 존재하지 않습니다.",
            alternates: {
                canonical: `https://your-portfolio.com/gallery`,
            },
            robots: {
                index: false,
                follow: true,
                googleBot: {
                    index: false,
                    follow: true,
                },
            },
        };
    }

    const content = typeof gallery.content === "string" ? gallery.content : "";
    const summary =
        content.length > 160 ? content.slice(0, 157) + "..." : content;

    return {
        title: `${gallery.title} | Portfolio Project`,
        description: summary || "사업분야 상세 페이지",
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            canonical: `https://your-portfolio.com/gallery/${id}`,
        },
    };
}

// 정적 생성 최적화: ISR (Incremental Static Regeneration) 사용
export const revalidate = 3600; // 1시간마다 재생성

export async function generateStaticParams() {
    try {
        const galleries = await prisma.gallery.findMany({
            select: { id: true },
        });

        return galleries.map(gallery => ({
            id: gallery.id.toString(),
        }));
    } catch (error) {
        // 빌드 시 데이터베이스 연결 실패 시 빈 배열 반환
        // 런타임에는 동적 라우팅으로 처리됨
        console.warn("Failed to generate static params for gallery pages:", error);
        return [];
    }
}

export default async function GalleryDetailPage({
    params,
}: GalleryDetailPageProps) {
    const { id } = await params;
    const gallery = await fetchGalleryDetail(Number(id));
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    if (!gallery) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <p className="text-center text-stone-500 mt-20 text-xl">
                    사업분야를 찾을 수 없습니다.
                </p>
            </div>
        );
    }

    const images = Array.isArray(gallery.images)
        ? (gallery.images as string[])
        : [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* 목록으로 버튼 */}
            <div className="mb-6">
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                    aria-label="갤러리 목록 페이지로 돌아가기"
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
                    목록으로
                </Link>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
                <div className="flex gap-2 mb-6 justify-end">
                    <Link
                        href={`/gallery/${gallery.id}/edit`}
                        aria-label={`${gallery.title} 갤러리 항목 수정하기`}
                    >
                        <button className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors text-sm font-medium">
                            수정
                        </button>
                    </Link>
                    <DeleteButton
                        apiPath={`/api/gallery/${gallery.id}`}
                        redirectPath="/gallery"
                        galleryId={gallery.id}
                    />
                </div>
            )}

            {/* 메인 카드 */}
            <Card className="shadow-xl border-stone-200 bg-white">
                <CardContent className="p-6 sm:p-8 md:p-10">
                    {/* 헤더 섹션 */}
                    <header className="mb-8 border-b border-stone-200 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                            {gallery.category && (
                                <Badge
                                    variant="secondary"
                                    className="text-sm px-3 py-1.5 bg-stone-100 text-stone-700 font-medium"
                                >
                                    {gallery.category}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
                            {gallery.title}
                        </h1>
                    </header>

                    {/* 이미지 갤러리 */}
                    {images.length > 0 && (
                        <section className="space-y-6 mb-12">
                            {images.map((url, idx) => {
                                const file = url.split("/").pop();
                                const imgUrl = toCloudFrontUrl(file);

                                if (!imgUrl) return null;

                                return (
                                    <div
                                        key={idx}
                                        className="relative w-full overflow-hidden bg-stone-50 rounded-lg border border-stone-200"
                                    >
                                        <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
                                            <Image
                                                src={imgUrl}
                                                alt={`${gallery.title}${
                                                    gallery.category
                                                        ? ` (${gallery.category})`
                                                        : ""
                                                } - 작업 사진 ${idx + 1}${
                                                    images.length > 1
                                                        ? ` (총 ${
                                                              images.length
                                                          }장 중 ${
                                                              idx + 1
                                                          }번째)`
                                                        : ""
                                                }`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
                                                className="object-contain"
                                                priority={idx === 0}
                                                fetchPriority={
                                                    idx === 0 ? "high" : "low"
                                                }
                                                loading={
                                                    idx === 0 ? "eager" : "lazy"
                                                }
                                                quality={idx === 0 ? 70 : 65}
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    {images.length === 0 && (
                        <div className="mb-12 h-[400px] bg-stone-50 rounded-lg flex items-center justify-center border border-stone-200">
                            <p className="text-stone-400 text-lg">
                                이미지가 없습니다
                            </p>
                        </div>
                    )}

                    {/* 컨텐츠 섹션 */}
                    {gallery.content &&
                        typeof gallery.content === "string" &&
                        gallery.content.trim() && (
                            <article className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                                {gallery.content}
                            </article>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}
