import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { uploadToS3, deleteFromS3 } from "../../../../lib/s3";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { fetchGalleryList } from "../../../../lib/gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
    try {
        const items = await fetchGalleryList();
        return NextResponse.json({ items });
    } catch (e) {
        console.error("API /api/gallery error:", e);
        return NextResponse.json({ error: "DB 에러" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const newUrls: string[] = [];

    try {
        const formData = await request.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const category = formData.get("category");
        const imageFiles = formData.getAll("images");

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "제목이 필요합니다." },
                { status: 400 }
            );
        }

        if (
            (!imageFiles || imageFiles.length === 0)
        ) {
            return NextResponse.json(
                { error: "적어도 하나의 이미지를 업로드해야 합니다." },
                { status: 400 }
            );
        }

        for (const file of imageFiles) {
            if (typeof file === "string") continue;
            if (!(file instanceof File)) continue;
            if (file.size === 0) continue;

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileExt = file.name?.split(".").pop() || "jpg";
            const fileName = `uploads/${uuidv4()}.${fileExt}`;
            const url = await uploadToS3(buffer, fileName, file.type);
            newUrls.push(url);
        }

        const result = await prisma.gallery.create({
            data: {
                title,
                content: typeof content === "string" ? content : "",
                category: typeof category === "string" ? category : null,
                images: newUrls,
            },
        });

        if (!result) {
            await deleteFromS3(newUrls);
            return NextResponse.json(
                { error: "DB 저장 실패(롤백 처리됨)" },
                { status: 500 }
            );
        }

        revalidatePath("/gallery");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Upload error:", error);

        if (newUrls.length > 0) {
            await deleteFromS3(newUrls);
        }

        const errorMessage = error instanceof Error ? error.message : "서버 오류";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}


