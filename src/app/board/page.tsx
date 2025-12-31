import { Suspense } from "react";
import SearchBox from "../components/board/search-box";
import Pagination from "../components/board/pagination";
import PostList from "../components/board/post-list";
import PostListSkeleton from "../components/board/post-list-skeleton";
import WriteButton from "../components/board/write-button";
import { getPosts } from "../actions/board/post/getPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BoardPageProps {
    searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
    const params = await searchParams;
    const search = params.search || "";
    const page = parseInt(params.page || "1", 10);
    const perPage = 10;

    const { posts, totalCount } = await getPosts({ search, page, perPage });
    const totalPages = Math.ceil(totalCount / perPage);

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-stone-900 mb-2 tracking-tight">
                    질문 게시판
                </h1>
                <p className="text-stone-600">
                    궁금한 사항을 자유롭게 질문해주세요
                </p>
            </div>

            <Card className="shadow-lg border-stone-200 bg-white">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle className="text-xl text-stone-900">
                            게시글 목록
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <SearchBox defaultValue={search} />
                            <WriteButton />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-stone-50 rounded-lg border border-stone-200 text-sm font-medium text-stone-700">
                        <div className="col-span-1 text-center">No</div>
                        <div className="col-span-6">제목</div>
                        <div className="col-span-2 text-center">작성자</div>
                        <div className="col-span-3 text-center">작성일</div>
                    </div>

                    <Suspense fallback={<PostListSkeleton />}>
                        <PostList
                            posts={posts}
                            totalCount={totalCount}
                            currentPage={page}
                            perPage={perPage}
                        />
                    </Suspense>

                    {totalPages > 1 && (
                        <Pagination
                            current={page}
                            total={totalPages}
                            search={search}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


