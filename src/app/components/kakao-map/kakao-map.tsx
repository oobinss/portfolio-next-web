"use client";

import { useEffect, useRef, useState } from "react";

interface KakaoMapProps {
    width?: string;
    height?: string;
    center?: { lat: number; lng: number };
}

interface WindowWithKakao extends Window {
    kakao?: {
        maps: {
            Map: new (container: HTMLElement, options: { center: unknown; level: number }) => unknown;
            LatLng: new (lat: number, lng: number) => unknown;
            Marker: new (options: { position: unknown; map: unknown }) => unknown;
            CustomOverlay: new (options: {
                position: unknown;
                content: HTMLElement;
                map: unknown;
                yAnchor: number;
            }) => unknown;
            load: (callback: () => void) => void;
        };
    };
}

export default function KakaoMap({
    width = "800px",
    height = "530px",
    center = { lat: 37.5665, lng: 126.9780 },
}: KakaoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false`;
        script.async = true;

        const createMap = () => {
            if (!mapRef.current) return;

            const windowWithKakao = window as WindowWithKakao;
            if (!windowWithKakao.kakao?.maps) {
                setError("카카오 지도 API를 불러오지 못했습니다.");
                return;
            }

            const map = new windowWithKakao.kakao.maps.Map(mapRef.current, {
                center: new windowWithKakao.kakao.maps.LatLng(center.lat, center.lng),
                level: 3,
            });

            const markerPosition = new windowWithKakao.kakao.maps.LatLng(
                center.lat,
                center.lng
            );

            new windowWithKakao.kakao.maps.Marker({
                position: markerPosition,
                map: map,
            });

            const content = document.createElement("div");
            content.innerHTML = "Portfolio Project";
            Object.assign(content.style, {
                padding: "4px 8px",
                background: "white",
                borderRadius: "5px",
                color: "black",
                fontSize: "12px",
                textAlign: "center",
                whiteSpace: "nowrap",
            });

            new windowWithKakao.kakao.maps.CustomOverlay({
                position: markerPosition,
                content,
                map,
                yAnchor: 2.5,
            });
        };

        const onLoadHandler = () => {
            const windowWithKakao = window as WindowWithKakao;
            if (windowWithKakao.kakao && windowWithKakao.kakao.maps) {
                windowWithKakao.kakao.maps.load(() => {
                    try {
                        createMap();
                    } catch (e) {
                        const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류";
                        setError(errorMessage);
                    }
                });
            } else {
                setError("카카오 지도 API를 불러오지 못했습니다.");
            }
        };

        script.addEventListener("load", onLoadHandler);
        script.addEventListener("error", () => setError("스크립트 로드 실패"));

        document.head.appendChild(script);

        return () => {
            script.removeEventListener("load", onLoadHandler);
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [center.lat, center.lng]);

    if (error) {
        return (
            <div
                style={{
                    width,
                    height,
                    lineHeight: height,
                    textAlign: "center",
                    color: "red",
                }}
            >
                지도 로드 오류: {error}
            </div>
        );
    }

    return <div ref={mapRef} style={{ width, height, position: "relative" }} />;
}


