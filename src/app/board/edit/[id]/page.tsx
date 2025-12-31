import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditBoardForm from "./editForm";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBoardPage({ params }: EditPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/auth/login?redirect=/board/edit/${id}`);
    }

    const post = await prisma.board.findUnique({
        where: { id: Number(id) },
        include: {
            author: true,
        },
    });

    if (!post) {
        return (
            <main className="flex justify-center items-start min-h-screen bg-gray-100 py-12">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                    <p className="text-center text-gray-500">게시글을 찾을 수 없습니다.</p>
                </div>
            </main>
        );
    }

    const isOwner = session.user.id === post.author_id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
        redirect(`/board/${id}`);
    }

    return (
        <main className="flex justify-center items-start min-h-screen bg-gray-100 py-12">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <Link
                        href={`/board/${id}`}
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
                        상세페이지로
                    </Link>
                    <h1 className="text-2xl font-bold">글 수정</h1>
                </div>
                <EditBoardForm post={post} />
            </div>
        </main>
    );
}


