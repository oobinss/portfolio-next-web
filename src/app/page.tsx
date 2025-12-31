import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import GalleryCategoryFilter from "@/app/components/gallery/gallery-category-filter";
import GalleryGridSkeleton from "@/app/components/gallery/gallery-grid-skeleton";
import { fetchGalleryList } from "../../lib/gallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

// 메인 페이지 정적 생성 최적화: ISR 사용
export const revalidate = 3600; // 1시간마다 재생성

// 갤러리 섹션을 별도 컴포넌트로 분리하여 비동기 로드
async function GallerySection() {
    const galleryItems = await fetchGalleryList();
    return (
        <GalleryCategoryFilter
            items={galleryItems.map(item => ({
                ...item,
                thumbnail: item.thumbnail,
            }))}
            showUploadButton={false}
        />
    );
}

export default async function Main() {
    return (
        <>
            {/* 히어로 섹션 */}
            <div className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
                <Image
                    src="/main-image.jpg"
                    alt="Portfolio Project 메인 배경 이미지"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    quality={65}
                    fetchPriority="high"
                    className="z-0 opacity-40"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-0" />

                <div className="relative z-10 flex items-center min-h-[90vh]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                                최신 기술로
                                <br />
                                <span className="text-stone-200">
                                    더 나은 웹을 만듭니다.
                                </span>
                            </h1>
                            <p className="text-white text-lg md:text-xl mb-8 leading-relaxed drop-shadow-lg max-w-3xl">
                                이 프로젝트는 Next.js를 기반으로 한 풀스택 웹 애플리케이션입니다.
                                게시판, 갤러리, 사용자 인증 등 다양한 기능을 포함하고 있으며,
                                현대적인 웹 개발 기술 스택을 활용하여 구축되었습니다.
                                <br />
                                <span className="font-semibold">
                                    포트폴리오 프로젝트로 제작되었습니다.
                                </span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/company"
                                    aria-label="포트폴리오 소개 페이지로 이동"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-white text-stone-900 hover:bg-stone-100 h-12 px-8 text-base shadow-lg"
                                    >
                                        포트폴리오 소개 보기
                                        <ArrowRight
                                            className="ml-2 h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </Link>
                                <Link
                                    href="/contact"
                                    aria-label="문의하기 페이지로 이동"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-white/90 backdrop-blur-sm border-2 border-white text-stone-900 hover:bg-white h-12 px-8 text-base shadow-lg font-semibold"
                                    >
                                        문의하기
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 포트폴리오 소개 섹션 */}
            <section className="py-24 bg-gradient-to-b from-white to-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                        <div className="w-full flex justify-center order-2 lg:order-1">
                            <Card className="overflow-hidden shadow-xl border-stone-200">
                                <Image
                                    src="/sub-image.jpg"
                                    alt="Portfolio Project 소개 이미지"
                                    width={800}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                    quality={65}
                                    sizes="(max-width: 1024px) 100vw, 800px"
                                />
                            </Card>
                        </div>
                        <div className="flex flex-col items-start order-1 lg:order-2">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-stone-900">
                                포트폴리오 소개
                            </h2>
                            <p className="text-stone-700 mb-8 leading-relaxed text-lg">
                                이 프로젝트는 Next.js, TypeScript, Prisma, NextAuth 등
                                최신 웹 개발 기술을 활용하여 구축되었습니다.
                                게시판, 갤러리, 사용자 인증 등 다양한 기능을 포함하고 있으며,
                                확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.
                            </p>
                            <Link
                                href="/company"
                                aria-label="포트폴리오 소개 페이지에서 더 자세한 정보 보기"
                            >
                                <Button size="lg" className="h-12 px-8">
                                    더 알아보기
                                    <ArrowRight
                                        className="ml-2 h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 갤러리 섹션 - Suspense로 분리하여 초기 렌더링 블로킹 방지 */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-900">
                            프로젝트 갤러리
                        </h2>
                        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                            프로젝트의 다양한 기능과 사례를 확인해보세요
                        </p>
                    </div>
                    <Suspense fallback={<GalleryGridSkeleton />}>
                        <GallerySection />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
