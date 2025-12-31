import prisma from "./prisma";
import type { Gallery } from "../src/generated/prisma";

const cloudfrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

export function toCloudFrontUrl(fileName: string | null | undefined): string | null {
    if (!fileName || typeof fileName !== "string") return null;
    if (!cloudfrontDomain) return null;
    // fileName이 이미 전체 URL인 경우 그대로 반환
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
        return fileName;
    }
    // 경로에서 앞의 슬래시 제거
    const cleanPath = fileName.startsWith("/") ? fileName.slice(1) : fileName;
    return `https://${cloudfrontDomain}/${cleanPath}`;
}

export function getSafeThumbnail(images: unknown): string | null {
    if (!Array.isArray(images) || images.length === 0) return null;

    const raw = images[0];
    if (typeof raw !== "string") return null;

    const cleaned = raw.trim();
    if (cleaned === "") return null;

    const file = cleaned.split("/").pop();
    if (!file) return null;

    return toCloudFrontUrl(file);
}

export interface GalleryListItem {
    id: number;
    title: string;
    category: string | null;
    images: unknown;
    thumbnail: string | null;
}

export async function fetchGalleryList(): Promise<GalleryListItem[]> {
    // 데이터베이스 쿼리 최적화: 필요한 필드만 선택
    const items = await prisma.gallery.findMany({
        orderBy: { id: "desc" },
        select: {
            id: true,
            title: true,
            category: true,
            images: true,
        },
        // 성능 최적화: 캐싱을 위해 take 제한 (필요시 조정)
        take: 100, // 최대 100개만 가져오기
    });

    return items.map(item => ({
        ...item,
        thumbnail: getSafeThumbnail(item.images),
    }));
}

export async function fetchGalleryDetail(id: number | string): Promise<Gallery | null> {
    if (!id) {
        throw new Error("fetchGalleryDetail: id가 전달되지 않았습니다.");
    }

    return await prisma.gallery.findUnique({
        where: { id: Number(id) },
    });
}


