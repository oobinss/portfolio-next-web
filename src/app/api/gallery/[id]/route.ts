import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { uploadToS3, deleteFromS3 } from "../../../../../lib/s3";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "admin")
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const gallery = await prisma.gallery.findUnique({
        where: { id: Number(id) },
    });

    if (!gallery)
        return NextResponse.json({ error: "Not Found" }, { status: 404 });

    const images = gallery.images as string[] | null;
    if (images && Array.isArray(images)) {
        await deleteFromS3(images);
    }

    await prisma.gallery.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true });
}

export async function PUT(request: Request, { params }: RouteParams) {
    const { id } = await params;
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
        const imageUrls = formData.getAll("imageUrls");

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "제목이 필요합니다." },
                { status: 400 }
            );
        }

        // 기존 이미지 URL 추출 (문자열만 필터링, 파일명만 추출)
        const existingImageFileNames: string[] = imageUrls
            .filter(
                (url): url is string =>
                    typeof url === "string" && url.trim().length > 0
            )
            .map(url => {
                const trimmed = url.trim();
                // URL에서 파일명만 추출
                if (
                    trimmed.startsWith("http://") ||
                    trimmed.startsWith("https://")
                ) {
                    return trimmed.split("/").pop() || trimmed;
                }
                return trimmed;
            });

        // 새로운 이미지 파일 업로드
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

        // 기존 이미지 파일명을 URL 형식으로 변환 (저장용)
        const existingImageUrls = existingImageFileNames.map(fileName => {
            // 이미 URL 형식이면 그대로 사용
            if (
                fileName.startsWith("http://") ||
                fileName.startsWith("https://")
            ) {
                return fileName;
            }
            // 파일명만 있으면 CloudFront URL 생성
            const cloudfrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
            if (cloudfrontDomain) {
                // 파일명에 uploads/가 없으면 추가
                const key = fileName.includes("/")
                    ? fileName
                    : `uploads/${fileName}`;
                return `https://${cloudfrontDomain}/${key}`;
            }
            return fileName;
        });

        // 기존 이미지와 새 이미지 합치기
        const allImageUrls = [...existingImageUrls, ...newUrls];

        // 이미지가 하나도 없으면 에러
        if (allImageUrls.length === 0) {
            return NextResponse.json(
                { error: "적어도 하나의 이미지가 필요합니다." },
                { status: 400 }
            );
        }

        // 기존 갤러리 데이터 조회 (삭제된 이미지 확인용)
        const existingGallery = await prisma.gallery.findUnique({
            where: { id: Number(id) },
            select: { images: true },
        });

        const existingImages =
            (existingGallery?.images as string[] | null) || [];

        // 삭제된 이미지 찾기 (파일명 기준)
        const deletedImages = existingImages.filter(img => {
            const imgFileName =
                img.startsWith("http://") || img.startsWith("https://")
                    ? img.split("/").pop() || img
                    : img.split("/").pop() || img;
            return !existingImageFileNames.includes(imgFileName);
        });

        // 삭제된 이미지가 있으면 S3에서도 삭제
        if (deletedImages.length > 0) {
            try {
                await deleteFromS3(deletedImages);
            } catch (error) {
                // S3 삭제 실패는 로그만 남기고 계속 진행
                console.error("S3 이미지 삭제 중 오류 (무시됨):", error);
            }
        }

        const updatedGallery = await prisma.gallery.update({
            where: { id: Number(id) },
            data: {
                title,
                content: typeof content === "string" ? content : "",
                category: typeof category === "string" ? category : null,
                images: allImageUrls,
            },
        });

        if (!updatedGallery) {
            await deleteFromS3(newUrls);
            return NextResponse.json(
                { error: "업데이트 실패" },
                { status: 500 }
            );
        }

        revalidatePath(`/gallery/${id}`);
        revalidatePath("/gallery");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update error:", error);
        if (newUrls.length > 0) await deleteFromS3(newUrls);
        const errorMessage =
            error instanceof Error ? error.message : "서버 오류";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
