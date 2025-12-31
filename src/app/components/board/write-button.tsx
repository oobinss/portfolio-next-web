"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function WriteButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if (!session) {
            toast.error("로그인이 필요합니다", {
                description: "로그인한 회원만 글을 작성할 수 있습니다.",
            });
            router.push("/auth/login");
            return;
        }

        router.push("/board/new");
    };

    return (
        <Button
            onClick={handleClick}
            size="default"
            className="gap-2"
            aria-label="새 게시글 작성"
        >
            <Plus className="h-4 w-4" aria-hidden="true" />
            글쓰기
        </Button>
    );
}


