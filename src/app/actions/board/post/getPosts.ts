import prisma from "../../../../../lib/prisma";
import type { BoardWithAuthor, PostsResponse } from "../../../../../lib/types/api.types";

interface GetPostsParams {
    search?: string;
    page?: number;
    perPage?: number;
}

export async function getPosts({
    search = "",
    page = 1,
    perPage = 10,
}: GetPostsParams = {}): Promise<PostsResponse> {
    const skip = (page - 1) * perPage;

    const where = {
        is_deleted: false,
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { content: { contains: search, mode: "insensitive" as const } },
            ],
        }),
    };

    const [posts, totalCount] = await Promise.all([
        prisma.board.findMany({
            where,
            skip,
            take: perPage,
            orderBy: { id: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        nickname: true,
                        phone: true,
                        password_hash: true,
                    },
                },
            },
        }),
        prisma.board.count({ where }),
    ]);

    // 세션 정보는 서버 컴포넌트에서 처리
    const postsWithCanBypass: BoardWithAuthor[] = posts.map((post) => ({
        ...post,
        canBypass: false, // 서버 컴포넌트에서 세션 확인 후 설정
    }));

    return {
        posts: postsWithCanBypass,
        totalCount,
    };
}


