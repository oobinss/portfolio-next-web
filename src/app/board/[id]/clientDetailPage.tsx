"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import PasswordModal from "@/app/components/common/passwordModal";

interface ClientDetailPageProps {
    post: {
        id: number;
        is_secret: boolean | null;
        author_id: number;
    };
    children: ReactNode;
}

export default function ClientDetailPage({ post, children }: ClientDetailPageProps) {
    const router = useRouter();
    const [showPasswordModal, setShowPasswordModal] = useState(true);

    function handlePasswordSuccess() {
        setShowPasswordModal(false);
        router.refresh();
    }

    function handleClose() {
        router.push("/board");
    }

    if (showPasswordModal) {
        return (
            <PasswordModal
                postId={post.id}
                onClose={handleClose}
                onSuccess={handlePasswordSuccess}
            />
        );
    }

    return <>{children}</>;
}


