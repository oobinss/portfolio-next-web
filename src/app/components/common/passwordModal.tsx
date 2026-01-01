"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useVerifyPostPassword } from "@/lib/hooks/usePosts";
import type { AxiosError } from "axios";

interface PasswordModalProps {
    postId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PasswordModal({ postId, onClose, onSuccess }: PasswordModalProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);

    const mutation = useVerifyPostPassword();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!password) {
            setError("비밀번호를 입력하세요");
            return;
        }

        mutation.mutate(
            { postId, password },
            {
                onSuccess: async () => {
                    setError("");
                    // 쿠키가 설정될 시간을 주기 위해 약간의 지연
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setOpen(false);
                    onSuccess();
                },
                onError: (error) => {
                    setError("비밀번호가 일치하지 않습니다");
                },
            }
        );
    }

    const handleClose = useCallback(() => {
        setOpen(false);
        onClose();
    }, [onClose]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === "Escape" && open) {
                handleClose();
            }
        }
        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [open, handleClose]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-5 w-5 text-stone-600" />
                        <DialogTitle>비밀글 인증</DialogTitle>
                    </div>
                    <DialogDescription>
                        이 게시글은 비밀글입니다. 비밀번호를 입력하여
                        확인하세요.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password-input" className="sr-only">
                            비밀번호 입력
                        </label>
                        <Input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            autoFocus
                            className={error ? "border-red-500" : ""}
                            aria-invalid={!!error}
                            aria-describedby={error ? "password-error" : undefined}
                        />
                        {error && (
                            <p
                                id="password-error"
                                className="text-sm text-red-600"
                                role="alert"
                                aria-live="polite"
                            >
                                {error}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={mutation.isPending}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-stone-900 hover:bg-stone-800"
                        >
                            {mutation.isPending ? "인증 중..." : "확인"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


