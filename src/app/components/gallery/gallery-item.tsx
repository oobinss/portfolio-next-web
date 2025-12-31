import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GalleryItemProps {
    id: number;
    title: string;
    content?: string | null;
    category?: string | null;
    thumbnail?: string | null;
}

export default function GalleryItem({
    id,
    title,
    content,
    category,
    thumbnail,
}: GalleryItemProps) {
    const src = thumbnail || "/no-image.jpg";

    return (
        <Link
            href={`/gallery/${id}`}
            className="block h-full group w-full"
            aria-label={`${title} 갤러리 항목 보기`}
        >
            <Card className="h-full w-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-stone-200 flex flex-col bg-white group-hover:border-stone-400 group-hover:-translate-y-1">
                {/* 인스타그램 피드 스타일: 정사각형 비율 유지 */}
                <figure className="relative w-full aspect-square bg-stone-100 overflow-hidden rounded-t-lg">
                    <Image
                        src={src}
                        alt={
                            category
                                ? `${category} 카테고리의 ${title} 작업 사진`
                                : `${title} 작업 사진`
                        }
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        quality={70}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </figure>
                <section className="p-4 sm:p-5 flex-1 flex flex-col bg-white border-t border-stone-100">
                    <header className="mb-2">
                        {category && (
                            <Badge
                                variant="secondary"
                                className="mb-2 text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            >
                                {category}
                            </Badge>
                        )}
                        <h3 className="text-base sm:text-lg font-semibold text-stone-900 mb-1.5 line-clamp-2 group-hover:text-stone-700 transition-colors">
                            {title}
                        </h3>
                    </header>
                    {content && (
                        <p className="text-xs sm:text-sm text-stone-600 flex-1 line-clamp-2 leading-relaxed">
                            {content}
                        </p>
                    )}
                </section>
            </Card>
        </Link>
    );
}
