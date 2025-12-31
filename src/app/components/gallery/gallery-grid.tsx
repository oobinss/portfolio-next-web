import GalleryItem from "./gallery-item";
import type { GalleryListItem } from "@/lib/gallery";

interface GalleryGridProps {
    items: GalleryListItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-stone-500 text-lg">데이터가 없습니다</p>
            </div>
        );
    }

    // 인스타그램 피드 스타일: 3열 그리드로 표시
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map(item => (
                <li key={item.id} className="flex">
                    <GalleryItem
                        id={item.id}
                        title={item.title}
                        content={null}
                        category={item.category}
                        thumbnail={item.thumbnail}
                    />
                </li>
            ))}
        </ul>
    );
}

