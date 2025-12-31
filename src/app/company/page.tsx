import Image from "next/image";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

// 카카오맵 동적 import로 지연 로드 (큰 라이브러리)
// 서버 컴포넌트에서는 ssr: false 사용 불가, 클라이언트 컴포넌트에서 처리
const KakaoMap = dynamic(
    () => import("@/app/components/kakao-map/kakao-map"),
    {
        loading: () => (
            <div className="w-full h-[600px] bg-stone-100 flex items-center justify-center">
                <p className="text-stone-500">지도 로딩 중...</p>
            </div>
        ),
    }
);

export default function Company() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-stone-50">
            {/* 포트폴리오 소개 섹션 */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            포트폴리오 소개
                        </h1>
                        <div className="w-24 h-1 bg-stone-900 mx-auto"></div>
                    </div>
                    <Card className="mb-12 shadow-lg border-stone-200 overflow-hidden">
                        <Image
                            src="/main-image.jpg"
                            alt="Portfolio Project 소개 이미지"
                            width={1000}
                            height={500}
                            className="w-full h-auto object-cover"
                            priority
                            quality={75}
                            sizes="(max-width: 1024px) 100vw, 1000px"
                        />
                    </Card>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg sm:text-xl text-stone-700 leading-relaxed text-center">
                            이 프로젝트는 Next.js를 기반으로 한 포트폴리오 웹 애플리케이션입니다.
                            현대적인 웹 개발 기술 스택을 활용하여 구축되었으며,
                            게시판, 갤러리, 사용자 인증 등 다양한 기능을 포함하고 있습니다.
                            <br /><br />
                            확장 가능하고 유지보수가 용이한 구조로 설계되었으며,
                            최신 웹 개발 모범 사례를 따르고 있습니다.
                            프로젝트에 대한 자세한 내용은 GitHub 저장소를 참고해주세요.
                        </p>
                    </div>
                </div>
            </section>

            {/* 오시는 길 섹션 */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            오시는 길
                        </h2>
                        <div className="w-24 h-1 bg-stone-900 mx-auto"></div>
                    </div>
                    <Card className="mb-12 shadow-lg border-stone-200 overflow-hidden">
                        <CardContent className="p-0">
                            <KakaoMap width="100%" height="600px" />
                        </CardContent>
                    </Card>
                    <Card className="max-w-2xl mx-auto shadow-lg border-stone-200">
                        <CardContent className="p-0">
                            <div className="divide-y divide-stone-200">
                                <div className="flex">
                                    <div className="w-32 sm:w-40 py-4 px-6 font-semibold text-stone-900 bg-stone-50 border-r border-stone-200 flex items-center">
                                        상호
                                    </div>
                                    <div className="flex-1 py-4 px-6 text-stone-700 flex items-center">
                                        Portfolio Project
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 sm:w-40 py-4 px-6 font-semibold text-stone-900 bg-stone-50 border-r border-stone-200 flex items-center">
                                        주소
                                    </div>
                                    <div className="flex-1 py-4 px-6 text-stone-700 flex items-center">
                                        서울특별시 강남구 테헤란로 123
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 sm:w-40 py-4 px-6 font-semibold text-stone-900 bg-stone-50 border-r border-stone-200 flex items-center">
                                        전화
                                    </div>
                                    <div className="flex-1 py-4 px-6 text-stone-700 flex items-center">
                                        010-0000-0000
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}


