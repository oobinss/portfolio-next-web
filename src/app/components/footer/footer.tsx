
export default function Footer() {
    return (
        <footer className="w-full bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Portfolio Project</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            Next.js 기반 풀스택 웹 애플리케이션입니다.
                            <br />
                            현대적인 웹 개발 기술을 활용하여 구축되었습니다.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">연락처</h3>
                        <div className="space-y-2 text-sm text-stone-400">
                            <p>전화: 010-0000-0000</p>
                            <p>팩스: 02-0000-0000</p>
                            <p>휴대폰: 010-0000-0000</p>
                            <p>이메일: contact@example.com</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">주소</h3>
                        <p className="text-stone-400 text-sm">
                            서울특별시 강남구 테헤란로 123
                        </p>
                        <p className="text-stone-500 text-xs mt-2">
                            사업자번호: 000-00-00000
                        </p>
                    </div>
                </div>
                <div className="border-t border-stone-800 pt-8 text-center">
                    <p className="text-stone-500 text-sm">
                        Copyright © 2024 Portfolio Project. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}


