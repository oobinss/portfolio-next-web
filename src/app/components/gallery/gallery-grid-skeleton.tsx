import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function GalleryGridSkeleton() {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx} className="flex">
                    <Card className="h-full w-full overflow-hidden">
                        <Skeleton className="w-full aspect-square" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    );
}


