import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <>
            <div className="relative w-full h-[450px] bg-black flex items-center justify-center">
                <Image
                    src="/main-image.jpg"
                    alt="오류 페이지"
                    width={1200}
                    height={400}
                    priority
                    className="object-cover w-full h-full shadow-md"
                />
            </div>

            <main className="max-w-5xl mx-auto py-14 px-6 flex flex-col items-center gap-10">
                <h1 className="text-2xl font-semibold text-gray-800 text-center">
                    요청하신 페이지가 존재하지 않거나 이동되었어요.
                </h1>
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    홈으로 돌아가기
                </Link>
            </main>
        </>
    );
}
