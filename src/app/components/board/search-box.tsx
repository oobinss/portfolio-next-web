"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBoxProps {
    defaultValue?: string;
}

export default function SearchBox({ defaultValue }: SearchBoxProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(defaultValue || "");

    // URL 파라미터 변경 시 입력값 동기화
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearchQuery(urlSearch);
    }, [searchParams]);

    // defaultValue가 변경되면 입력값 업데이트
    useEffect(() => {
        if (defaultValue !== undefined) {
            setSearchQuery(defaultValue);
        }
    }, [defaultValue]);

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            router.push(`/board?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/board");
        }
    };

    return (
        <form
            onSubmit={onSearch}
            className="flex gap-2 w-full max-w-md"
            role="search"
            aria-label="게시글 검색"
        >
            <div className="relative flex-1">
                <label htmlFor="search-input" className="sr-only">
                    게시글 검색
                </label>
                <Input
                    id="search-input"
                    type="search"
                    placeholder="제목, 내용, 작성자로 검색..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                    aria-label="검색어 입력"
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400"
                    aria-hidden="true"
                />
            </div>
            <Button type="submit" variant="default" aria-label="검색 실행">
                검색
            </Button>
        </form>
    );
}


