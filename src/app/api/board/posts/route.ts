import { getPosts } from "@/app/actions/board/post/getPosts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 10);

    try {
        const data = await getPosts({ search, page, perPage });

        return NextResponse.json(
            { posts: data.posts, totalCount: data.totalCount },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json({ error: "서버 에러 발생" }, {
            status: 500,
        });
    }
}


