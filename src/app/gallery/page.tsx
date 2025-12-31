import { Suspense } from "react";
import GalleryCategoryFilter from "@/app/components/gallery/gallery-category-filter";
import GalleryGridSkeleton from "@/app/components/gallery/gallery-grid-skeleton";
import { fetchGalleryList } from "../../../lib/gallery";

export default async function GalleryPage() {
    const galleryItems = await fetchGalleryList();

    return (
        <Suspense fallback={<GalleryGridSkeleton />}>
            <GalleryCategoryFilter
                items={galleryItems}
                showUploadButton={true}
            />
        </Suspense>
    );
}

