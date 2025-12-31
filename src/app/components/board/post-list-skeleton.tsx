import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PostListSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
                <Card key={idx} className="p-4">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-6" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}


