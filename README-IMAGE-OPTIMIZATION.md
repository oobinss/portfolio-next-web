# 이미지 최적화 가이드

이 프로젝트는 Next.js Image 컴포넌트와 함께 이미지 최적화를 지원합니다.

## 자동 최적화 (Next.js Image 컴포넌트)

Next.js Image 컴포넌트는 자동으로 다음을 수행합니다:

-   **AVIF 포맷**: 지원하는 브라우저에 자동 제공 (최고 압축률)
-   **WebP 포맷**: AVIF를 지원하지 않는 브라우저에 제공
-   **원본 포맷**: 최신 포맷을 지원하지 않는 브라우저에 제공
-   **반응형 이미지**: 디바이스 크기에 맞는 이미지 자동 생성
-   **Lazy Loading**: 뷰포트 밖 이미지 자동 지연 로딩

## 수동 이미지 최적화 (선택사항)

더 나은 성능을 위해 이미지를 미리 변환할 수 있습니다.

### 1. 의존성 설치

```bash
npm install --save-dev sharp
```

### 2. 이미지 최적화 실행

```bash
npm run optimize-images
```

이 스크립트는 `public` 폴더의 모든 JPG/PNG 이미지를 WebP와 AVIF로 변환합니다.

### 3. 변환 결과

스크립트 실행 후:

-   `mainImage.jpg` → `mainImage.webp`, `mainImage.avif` 생성
-   `no-image.jpg` → `no-image.webp`, `no-image.avif` 생성

### 4. 코드에서 사용

Next.js Image 컴포넌트는 자동으로 최적 포맷을 선택합니다:

```tsx
import Image from "next/image";

// 자동으로 AVIF → WebP → 원본 순서로 선택
<Image src="/mainImage.jpg" alt="설명" width={800} height={500} />;
```

## 성능 개선 효과

-   **AVIF**: 원본 대비 약 50-70% 파일 크기 감소
-   **WebP**: 원본 대비 약 25-35% 파일 크기 감소
-   **로딩 속도**: 이미지 로딩 시간 30-50% 단축
-   **대역폭**: 모바일 사용자 데이터 사용량 감소

## 주의사항

1. **원본 파일 보존**: 변환된 파일은 원본과 함께 보관됩니다.
2. **Git 저장소**: 변환된 파일(.webp, .avif)은 `.gitignore`에 추가하지 마세요.
3. **CloudFront 이미지**: S3/CloudFront에 업로드된 이미지는 Next.js가 자동으로 최적화합니다.

## 추가 최적화 팁

1. **이미지 크기 조정**: 큰 이미지는 적절한 크기로 리사이즈 후 업로드
2. **품질 설정**: `quality` prop으로 품질과 파일 크기 균형 조정
3. **Priority 설정**: 첫 화면 이미지는 `priority` prop 사용
