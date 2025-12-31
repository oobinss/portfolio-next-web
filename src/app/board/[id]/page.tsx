import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import Link from "next/link";
import ClientCommentForm from "./clientCommentForm";
import prisma from "../../../../lib/prisma";
import ClientComments from "./clientComments";
import DeleteButton from "@/app/components/common/delete-button";
import { cookies } from "next/headers";
import ClientDetailPage from "./clientDetailPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import type { CommentWithAuthor } from "@/lib/types/api.types";

interface BoardDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BoardDetailPageProps): Promise<Metadata> {
    const { id } = await params;

    const post = await prisma.board.findFirst({
        where: {
            id: Number(id),
            is_deleted: false,
        },
        select: {
            title: true,
            content: true,
        },
    });

    if (!post) {
        return {
            title: "게시글을 찾을 수 없습니다 - Portfolio Project",
            description:
                "요청하신 게시글을 찾을 수 없습니다. 다른 게시글을 확인해 주세요.",
            alternates: {
                canonical: `https://your-portfolio.com/board`,
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

    const summary =
        post.content.length > 160
            ? post.content.slice(0, 157) + "..."
            : post.content;

    return {
        title: `${post.title} | Portfolio Project`,
        description: summary,
        alternates: {
            canonical: `https://your-portfolio.com/board/${id}`,
        },
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
    };
}

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const post = await prisma.board.findFirst({
        where: {
            id: Number(id),
            is_deleted: false,
        },
        include: {
            author: true,
            comments: {
                where: { is_deleted: false },
                include: {
                    author: true,
                    replies: {
                        where: { is_deleted: false },
                        include: { author: true },
                    },
                },
            },
        },
    });

    if (!post) {
        return (
            <main>
                <div>게시글을 찾을 수 없습니다.</div>
            </main>
        );
    }

    const comments: (CommentWithAuthor & { isCommentOwner?: boolean })[] = post.comments.map(comment => ({
        ...comment,
        isCommentOwner: session?.user?.id === comment.author_id,
        author: comment.author || {
            id: 0,
            name: null,
            email: null,
            password_hash: null,
            nickname: null,
            phone: null,
        },
        replies: [],
    }));

    const isOwner = session?.user?.id === post.author_id;
    const isAdmin = session?.user?.role === "admin";
    const isLoggedIn = !!session;
    const cookieStore = await cookies();
    const hasPasswordAccess =
        cookieStore.get(`board_access_${id}`)?.value === "1";

    if (post.is_secret && !isOwner && !isAdmin && !hasPasswordAccess) {
        return (
            <ClientDetailPage
                post={{
                    id: post.id,
                    is_secret: post.is_secret,
                    author_id: post.author_id,
                }}
            >
                <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-20 px-4">
                    <div className="w-full max-w-md mx-auto">
                        <Card className="shadow-lg border-stone-200 text-center">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-stone-900">
                                    비밀글입니다
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-stone-600 mb-6 leading-relaxed">
                                    비밀번호를 입력하세요.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </ClientDetailPage>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12 px-4">
            <div className="w-full max-w-4xl mx-auto">
                <div className="mb-4">
                    <Link
                        href="/board"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
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
                        목록으로
                    </Link>
                </div>
                <Card className="shadow-lg border-stone-200">
                    <CardHeader className="pb-4 border-b border-stone-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-3xl font-bold text-stone-900 mb-2">
                                    {post.title}
                                </CardTitle>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <span className="font-medium">
                                        {post.author.nickname || post.author.name}
                                    </span>
                                    <span className="text-stone-400">•</span>
                                    <span>
                                        {post.created_at
                                            ? new Date(
                                                  post.created_at instanceof Date
                                                      ? post.created_at
                                                      : post.created_at
                                              ).toLocaleDateString("ko-KR", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : ""}
                                    </span>
                                </div>
                            </div>

                            {(isOwner || isAdmin) && (
                                <div className="flex gap-2">
                                    <Link
                                        href={`/board/edit/${post.id}`}
                                        className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors text-sm font-medium"
                                    >
                                        수정
                                    </Link>
                                    <DeleteButton
                                        postId={post.id}
                                        redirectPath="/board"
                                    />
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="mb-8">
                            <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                                {post.content}
                            </div>
                        </div>

                        <section className="mt-8 pt-8 border-t border-stone-200">
                            <h3 className="text-xl font-semibold text-stone-900 mb-6">
                                댓글
                            </h3>
                            <ClientComments
                                comments={comments}
                                isOwner={isOwner}
                                isAdmin={isAdmin}
                            />
                        </section>

                        {/* 댓글 작성 폼(로그인한 경우만) */}
                        {isLoggedIn ? (
                            <div className="mt-6">
                                <ClientCommentForm postId={post.id} />
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200 text-center">
                                <p className="text-stone-600">
                                    댓글을 작성하려면{" "}
                                    <Link
                                        href={`/auth/login?redirect=/board/${post.id}`}
                                        className="text-stone-900 font-medium hover:underline"
                                    >
                                        로그인
                                    </Link>
                                    해주세요.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

