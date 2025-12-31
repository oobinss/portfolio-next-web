# 🚀 Portfolio Next.js Web Application

> Next.js 15의 최신 기능을 활용하여 구축된 풀스택 웹 애플리케이션 포트폴리오 프로젝트입니다.

## 📋 프로젝트 개요

이 프로젝트는 **Next.js 15 App Router**, **TypeScript**, **Prisma**, **NextAuth**를 기반으로 한 현대적인 풀스택 웹 애플리케이션입니다. 게시판, 갤러리, 사용자 인증 등 다양한 기능을 포함하고 있으며, 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.

### ✨ 주요 특징

-   🎯 **최신 기술 스택**: Next.js 15 App Router, React 19, TypeScript 5.9
-   🔐 **완전한 인증 시스템**: NextAuth.js 기반 사용자 인증 및 세션 관리
-   📝 **풍부한 게시판 기능**: CRUD, 검색, 페이지네이션, 비밀글, 댓글 시스템
-   🖼️ **이미지 갤러리**: 카테고리별 필터링, AWS S3 연동 이미지 관리
-   ⚡ **성능 최적화**: ISR, 이미지 최적화, 코드 스플리팅, Suspense
-   🎨 **반응형 디자인**: 모바일부터 데스크톱까지 완벽한 UI/UX
-   🔒 **보안 강화**: 비밀번호 해싱, API 라우트 보호, 환경 변수 관리

## 🎯 주요 기능

### 📝 게시판 시스템

-   **CRUD 기능**: 게시글 작성, 조회, 수정, 삭제
-   **검색 기능**: 제목 및 내용 기반 실시간 검색
-   **페이지네이션**: 효율적인 데이터 분할 및 네비게이션
-   **비밀글**: 비밀번호로 보호되는 게시글 기능
-   **댓글 시스템**: 댓글 작성, 수정, 삭제 및 대댓글 지원
-   **작성자 정보**: 게시글별 작성자 표시 및 관리

### 🖼️ 갤러리 시스템

-   **이미지 업로드**: 다중 이미지 업로드 및 관리
-   **카테고리 필터링**: 카테고리별 이미지 분류 및 필터링 (음식, 여행, 일상)
-   **이미지 최적화**: Next.js Image 컴포넌트를 활용한 자동 최적화
-   **AWS S3 연동**: 클라우드 기반 이미지 저장 및 CDN 배포
-   **반응형 그리드**: 다양한 화면 크기에 최적화된 레이아웃

### 🔐 인증 시스템

-   **회원가입/로그인**: 이메일 기반 사용자 인증
-   **세션 관리**: NextAuth.js를 통한 안전한 세션 관리
-   **비밀번호 보안**: bcrypt를 활용한 비밀번호 해싱
-   **사용자 프로필**: 닉네임, 이메일, 전화번호 관리

### 🗺️ 추가 기능

-   **카카오 맵 연동**: 위치 표시 및 지도 기능
-   **문의하기**: 연락처 및 문의 폼
-   **반응형 네비게이션**: 모바일 친화적인 메뉴 시스템

## 🛠️ 기술 스택

### Frontend

-   **프레임워크**: Next.js 15.0.4 (App Router)
-   **언어**: TypeScript 5.9.3
-   **UI 라이브러리**: React 19.0.0
-   **스타일링**: Tailwind CSS 3.4.1
-   **아이콘**: Lucide React 0.562.0
-   **UI 컴포넌트**: 커스텀 컴포넌트 (Button, Card, Dialog, Toast 등)

### Backend & Database

-   **ORM**: Prisma 6.16.2
-   **데이터베이스**: PostgreSQL (Supabase)
-   **인증**: NextAuth.js 4.24.11
-   **API**: Next.js API Routes

### 상태 관리 & 데이터 페칭

-   **상태 관리**: Zustand 5.0.9
-   **서버 상태**: TanStack Query (React Query) 5.90.2
-   **폼 관리**: React Hook Form 7.62.0
-   **폼 검증**: Zod 4.1.8

### 클라우드 & 인프라

-   **이미지 저장소**: AWS S3
-   **CDN**: AWS CloudFront (선택사항)
-   **배포**: Vercel (권장)

### 개발 도구

-   **이미지 최적화**: Sharp 0.33.5
-   **코드 품질**: ESLint 9.38.0
-   **타입 체킹**: TypeScript

## 📁 프로젝트 구조

```
portfolio-next-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API 라우트 핸들러
│   │   │   ├── auth/                 # 인증 API (NextAuth, 회원가입)
│   │   │   ├── board/                # 게시판 API (CRUD, 댓글)
│   │   │   └── gallery/              # 갤러리 API (이미지 관리)
│   │   ├── auth/                     # 인증 페이지 (로그인, 회원가입)
│   │   ├── board/                    # 게시판 페이지
│   │   │   ├── [id]/                 # 게시글 상세 페이지
│   │   │   ├── edit/[id]/            # 게시글 수정 페이지
│   │   │   └── new/                  # 게시글 작성 페이지
│   │   ├── gallery/                  # 갤러리 페이지
│   │   │   ├── [id]/                 # 갤러리 상세 페이지
│   │   │   └── new/                  # 갤러리 업로드 페이지
│   │   ├── components/               # 페이지별 컴포넌트
│   │   │   ├── board/                # 게시판 컴포넌트
│   │   │   ├── gallery/              # 갤러리 컴포넌트
│   │   │   ├── main-header/          # 헤더 컴포넌트
│   │   │   └── common/               # 공통 컴포넌트
│   │   ├── company/                  # 포트폴리오 소개 페이지
│   │   ├── contact/                  # 문의하기 페이지
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   └── page.tsx                  # 메인 페이지
│   ├── components/                   # 공통 UI 컴포넌트
│   │   └── ui/                       # 재사용 가능한 UI 컴포넌트
│   └── generated/                    # Prisma 생성 파일
├── lib/                              # 라이브러리 및 유틸리티
│   ├── api/                          # API 클라이언트 함수
│   │   ├── board.ts                 # 게시판 API 클라이언트
│   │   └── gallery.ts                # 갤러리 API 클라이언트
│   ├── hooks/                        # React Query 커스텀 훅
│   │   ├── usePosts.ts              # 게시글 관련 훅
│   │   ├── useComments.ts           # 댓글 관련 훅
│   │   └── useGallery.ts            # 갤러리 관련 훅
│   ├── stores/                       # Zustand 상태 관리
│   │   ├── boardStore.ts            # 게시판 상태
│   │   ├── galleryStore.ts          # 갤러리 상태
│   │   └── uiStore.ts               # UI 상태
│   ├── types/                        # TypeScript 타입 정의
│   ├── utils/                        # 유틸리티 함수
│   ├── auth.ts                       # NextAuth 설정
│   ├── prisma.ts                     # Prisma 클라이언트
│   └── s3.ts                         # AWS S3 유틸리티
├── prisma/                           # Prisma 설정
│   ├── schema.prisma                 # 데이터베이스 스키마
│   └── migrations/                   # 데이터베이스 마이그레이션
├── public/                           # 정적 파일 (이미지, 아이콘 등)
├── scripts/                          # 빌드 스크립트
└── package.json                      # 프로젝트 의존성
```

## 🚀 시작하기

### 필수 요구사항

-   **Node.js**: 18.x 이상
-   **npm** 또는 **yarn**: 패키지 관리자
-   **Supabase 계정**: PostgreSQL 데이터베이스 (무료 플랜 사용 가능)
-   **AWS 계정**: 이미지 업로드 기능 사용 시 (선택사항)

### 📦 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd portfolio-next-web
```

#### 2. 의존성 설치

```bash
npm install
```

#### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# ============================================
# 데이터베이스 설정 (필수)
# ============================================
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# ============================================
# NextAuth 설정 (필수)
# ============================================
NEXTAUTH_SECRET="your-secret-key-here"  # 32자 이상 랜덤 문자열 권장
NEXTAUTH_URL="http://localhost:3000"     # 개발 환경
# NEXTAUTH_URL="https://your-domain.com"  # 프로덕션 환경

# ============================================
# AWS S3 설정 (이미지 업로드 사용 시)
# ============================================
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain.cloudfront.net"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"

# ============================================
# 선택적 설정
# ============================================
NEXT_PUBLIC_BASE_URL=""                    # API 베이스 URL
NEXT_PUBLIC_KAKAO_KEY="your-kakao-map-api-key"  # 카카오 맵 API 키
```

**🔧 Supabase DIRECT_URL 설정 방법:**

1. [Supabase](https://supabase.com)에 로그인
2. 프로젝트 선택 → **Settings** → **Database**
3. **Connection string** 섹션에서 **Direct connection** → **URI** 탭 선택
4. 연결 문자열 복사 (형식: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)
5. `[YOUR-PASSWORD]`를 실제 데이터베이스 비밀번호로 교체
    - 비밀번호는 Supabase 프로젝트 설정에서 확인하거나 재설정할 수 있습니다
    - **⚠️ 중요**: Supabase는 Connection pooling과 Direct connection을 구분합니다. Prisma는 Direct connection을 사용하므로 **Direct connection**의 URI를 사용해야 합니다.

**🔐 NEXTAUTH_SECRET 생성 방법:**

```bash
# OpenSSL 사용 (권장)
openssl rand -base64 32

# 또는 온라인 생성기 사용
# https://generate-secret.vercel.app/32
```

#### 4. 데이터베이스 마이그레이션

```bash
# 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 생성
npx prisma generate
```

#### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요! 🎉

## 📜 사용 가능한 스크립트

| 명령어                    | 설명                                   |
| ------------------------- | -------------------------------------- |
| `npm run dev`             | 개발 서버 실행 (http://localhost:3000) |
| `npm run build`           | 프로덕션 빌드 생성                     |
| `npm run start`           | 프로덕션 서버 실행                     |
| `npm run lint`            | ESLint를 사용한 코드 검사              |
| `npm run optimize-images` | 이미지 최적화 스크립트 실행            |

## 🚀 배포

### Vercel 배포 (권장)

Vercel은 Next.js 애플리케이션을 배포하기에 가장 적합한 플랫폼입니다.

#### 배포 단계

1. **Vercel 프로젝트 생성**

    - [Vercel](https://vercel.com)에 로그인
    - "New Project" 클릭
    - GitHub 저장소 선택 또는 연결

2. **환경 변수 설정**

    - Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
    - `.env` 파일의 모든 환경 변수 추가
    - **중요**: `NEXTAUTH_URL`을 프로덕션 도메인으로 설정

3. **빌드 설정**

    - Build Command: `npm run build` (기본값)
    - Output Directory: `.next` (기본값)
    - Install Command: `npm install` (기본값)

4. **자동 배포**
    - Git 저장소에 푸시하면 자동으로 배포됩니다
    - 각 브랜치별로 프리뷰 배포가 생성됩니다

#### 배포 전 체크리스트

-   [ ] 모든 환경 변수가 Vercel에 설정되었는지 확인
-   [ ] `NEXTAUTH_URL`이 프로덕션 도메인으로 설정되었는지 확인
-   [ ] 데이터베이스 마이그레이션이 완료되었는지 확인
-   [ ] AWS S3 버킷 CORS 설정이 올바른지 확인 (이미지 업로드 사용 시)

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## ⚙️ 환경 변수

### 필수 환경 변수

| 변수명            | 설명                                | 예시                                                                 |
| ----------------- | ----------------------------------- | -------------------------------------------------------------------- |
| `DIRECT_URL`      | Supabase PostgreSQL 연결 문자열     | `postgresql://postgres:password@...`                                 |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 키 (32자 이상) | `openssl rand -base64 32`로 생성                                     |
| `NEXTAUTH_URL`    | 애플리케이션 URL                    | 개발: `http://localhost:3000`<br>프로덕션: `https://your-domain.com` |

### 이미지 업로드 사용 시 필수 환경 변수

| 변수명                  | 설명                         | 예시                                       |
| ----------------------- | ---------------------------- | ------------------------------------------ |
| `AWS_REGION`            | AWS 리전                     | `ap-northeast-2` (서울)                    |
| `AWS_S3_BUCKET_NAME`    | S3 버킷 이름                 | `my-portfolio-images`                      |
| `AWS_CLOUDFRONT_DOMAIN` | CloudFront 도메인 (선택사항) | `d1234abcd.cloudfront.net`                 |
| `AWS_ACCESS_KEY_ID`     | AWS 액세스 키 ID             | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | AWS 시크릿 액세스 키         | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

### 선택적 환경 변수

| 변수명                  | 설명             | 기본값                  |
| ----------------------- | ---------------- | ----------------------- |
| `NEXT_PUBLIC_BASE_URL`  | API 베이스 URL   | 빈 문자열               |
| `NEXT_PUBLIC_KAKAO_KEY` | 카카오 맵 API 키 | 없음 (맵 기능 비활성화) |

> ⚠️ **보안 주의사항**: `.env` 파일은 절대 Git에 커밋하지 마세요. `.gitignore`에 포함되어 있는지 확인하세요.

## 🗄️ 데이터베이스

이 프로젝트는 **Supabase (PostgreSQL)**를 사용하며, **Prisma ORM**으로 데이터베이스를 관리합니다.

### 데이터베이스 모델

프로젝트는 다음 모델들을 포함합니다:

-   **User**: 사용자 정보 (이메일, 닉네임, 비밀번호 해시)
-   **Board**: 게시글 (제목, 내용, 작성자, 비밀글 여부)
-   **Comment**: 댓글 (게시글, 작성자, 대댓글 지원)
-   **Gallery**: 갤러리 (제목, 내용, 카테고리, 이미지)
-   **Account**: NextAuth 계정 정보
-   **Session**: NextAuth 세션 정보

### Supabase 설정

1. **[Supabase](https://supabase.com)에서 새 프로젝트 생성**

    - 무료 플랜으로 시작 가능
    - 프로젝트 이름과 데이터베이스 비밀번호 설정

2. **연결 문자열 복사**

    - 프로젝트 → **Settings** → **Database**
    - **Connection string** 섹션에서 **Direct connection** → **URI** 탭 선택
    - 연결 문자열 복사

3. **환경 변수 설정**

    - `.env` 파일에 `DIRECT_URL` 설정
    - Supabase에서 **Direct connection**의 URI를 복사하여 사용
    - `[YOUR-PASSWORD]`를 실제 비밀번호로 교체

4. **마이그레이션 실행**
    ```bash
    npx prisma migrate deploy
    npx prisma generate
    ```

### Prisma 명령어

```bash
# 개발 환경 마이그레이션 생성 및 적용
npx prisma migrate dev --name migration_name

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 생성 (스키마 변경 후 필수)
npx prisma generate

# 데이터베이스 스키마 시각화 (브라우저에서 확인)
npx prisma studio

# 데이터베이스 스키마 포맷팅
npx prisma format

# 데이터베이스 리셋 (주의: 모든 데이터 삭제)
npx prisma migrate reset
```

### Prisma Studio

데이터베이스를 시각적으로 확인하고 관리할 수 있는 GUI 도구입니다:

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555`가 자동으로 열리며, 데이터베이스의 모든 테이블과 데이터를 확인할 수 있습니다.

## 🔒 보안

이 프로젝트는 보안을 최우선으로 고려하여 설계되었습니다.

### 구현된 보안 기능

-   ✅ **비밀번호 해싱**: bcrypt를 사용한 안전한 비밀번호 저장
-   ✅ **세션 관리**: NextAuth.js를 통한 안전한 세션 관리
-   ✅ **API 라우트 보호**: 인증 및 권한 체크를 통한 API 접근 제어
-   ✅ **환경 변수 보호**: 민감한 정보는 환경 변수로 관리
-   ✅ **입력 검증**: Zod를 사용한 폼 데이터 검증
-   ✅ **SQL 인젝션 방지**: Prisma ORM을 통한 안전한 쿼리 실행
-   ✅ **XSS 방지**: React의 기본 XSS 방지 기능 활용

### 보안 모범 사례

1. **환경 변수 관리**

    - `.env` 파일은 절대 Git에 커밋하지 않음
    - 프로덕션에서는 Vercel 환경 변수 사용
    - `NEXTAUTH_SECRET`은 충분히 긴 랜덤 문자열 사용

2. **비밀번호 보안**

    - bcrypt를 사용한 해싱 (salt rounds: 10)
    - 평문 비밀번호는 절대 저장하지 않음

3. **API 보안**

    - 모든 API 라우트에서 적절한 인증 체크
    - 권한이 필요한 작업은 추가 검증 수행

4. **데이터베이스 보안**
    - Supabase의 기본 보안 기능 활용
    - Row Level Security (RLS) 정책 적용 가능

## 🎨 주요 구현 사항

### 성능 최적화

-   **ISR (Incremental Static Regeneration)**: 메인 페이지 1시간마다 재생성
-   **이미지 최적화**: Next.js Image 컴포넌트를 활용한 자동 최적화
-   **코드 스플리팅**: 동적 import를 통한 번들 크기 최적화
-   **Suspense**: 비동기 컴포넌트 로딩 최적화
-   **React Query 캐싱**: 서버 상태 캐싱으로 불필요한 요청 감소

### 사용자 경험 (UX)

-   **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
-   **로딩 상태**: Skeleton UI를 활용한 로딩 피드백
-   **에러 처리**: 사용자 친화적인 에러 메시지
-   **폼 검증**: 실시간 입력 검증 및 피드백
-   **토스트 알림**: Sonner를 활용한 알림 시스템

### 코드 품질

-   **TypeScript**: 타입 안정성 보장
-   **ESLint**: 코드 품질 검사
-   **컴포넌트 분리**: 재사용 가능한 컴포넌트 구조
-   **커스텀 훅**: 로직 재사용성 향상

## 🏗️ 아키텍처 설계

### 디렉토리 구조 설계 원칙

-   **App Router 기반**: Next.js 15의 최신 라우팅 시스템 활용
-   **컴포넌트 분리**: 페이지별 컴포넌트와 공통 컴포넌트 명확히 구분
-   **관심사 분리**: API 클라이언트, 훅, 스토어, 유틸리티 분리
-   **타입 안정성**: TypeScript를 통한 엔드투엔드 타입 안정성

### 상태 관리 전략

-   **서버 상태**: TanStack Query를 통한 서버 상태 관리 및 캐싱
-   **클라이언트 상태**: Zustand를 통한 전역 클라이언트 상태 관리
-   **폼 상태**: React Hook Form을 통한 폼 상태 관리

### API 설계

-   **RESTful API**: Next.js API Routes를 활용한 RESTful API 설계
-   **에러 처리**: 일관된 에러 응답 형식
-   **인증/인가**: NextAuth.js를 통한 통합 인증 시스템

## 📚 참고 자료

### 공식 문서

-   [Next.js 공식 문서](https://nextjs.org/docs) - Next.js 15 App Router 가이드
-   [Prisma 공식 문서](https://www.prisma.io/docs) - Prisma ORM 가이드
-   [Supabase 공식 문서](https://supabase.com/docs) - Supabase 사용 가이드
-   [NextAuth.js 공식 문서](https://next-auth.js.org) - 인증 라이브러리 가이드
-   [TanStack Query 문서](https://tanstack.com/query/latest) - React Query 가이드
-   [Tailwind CSS 문서](https://tailwindcss.com/docs) - 유틸리티 CSS 프레임워크

### 학습 자료

-   [Next.js 학습 경로](https://nextjs.org/learn)
-   [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
-   [React 공식 문서](https://react.dev)

## 📄 라이선스

이 프로젝트는 **포트폴리오용**으로 제작되었습니다.

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
