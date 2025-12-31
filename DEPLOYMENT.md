# 배포 가이드

이 문서는 Portfolio Project를 Vercel에 배포하는 방법을 설명합니다.

## 배포 전 체크리스트

### 1. 코드 품질 검증

-   [x] TypeScript 컴파일 오류 없음 (`npx tsc --noEmit`)
-   [x] 빌드 성공 (`npm run build`)
-   [x] 린트 오류 없음 (`npm run lint`)

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

#### 필수 환경 변수

-   `DIRECT_URL` - Supabase PostgreSQL 연결 문자열
-   `NEXTAUTH_SECRET` - 32자 이상의 랜덤 문자열 (생성: `openssl rand -base64 32`)
-   `NEXTAUTH_URL` - 프로덕션 도메인 (예: `https://your-portfolio.com`)
-   `AWS_REGION` - AWS 리전 (예: `ap-northeast-2`) - 이미지 업로드 사용 시
-   `AWS_S3_BUCKET_NAME` - S3 버킷 이름 - 이미지 업로드 사용 시
-   `AWS_CLOUDFRONT_DOMAIN` - CloudFront 도메인 - 이미지 업로드 사용 시
-   `AWS_ACCESS_KEY_ID` - AWS 액세스 키 ID - 이미지 업로드 사용 시
-   `AWS_SECRET_ACCESS_KEY` - AWS 시크릿 액세스 키 - 이미지 업로드 사용 시

#### 선택적 환경 변수

-   `NEXT_PUBLIC_BASE_URL` - API 베이스 URL (필요시)
-   `NEXT_PUBLIC_KAKAO_KEY` - 카카오 맵 API 키 (필요시)

### 3. Supabase 데이터베이스 설정

#### 3.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
    - **Name**: 프로젝트 이름
    - **Database Password**: 강력한 비밀번호 설정 (저장해두세요)
    - **Region**: 가장 가까운 리전 선택
4. 프로젝트 생성 완료 대기 (약 2분 소요)

#### 3.2 데이터베이스 연결 문자열 가져오기

1. Supabase 대시보드에서 프로젝트 선택
2. "Settings" → "Database" 메뉴로 이동
3. "Connection string" 섹션에서 "URI" 탭 선택
4. 연결 문자열 복사 (형식: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)
5. `[YOUR-PASSWORD]`를 실제 데이터베이스 비밀번호로 교체

#### 3.3 데이터베이스 마이그레이션

로컬에서 Supabase 데이터베이스에 마이그레이션을 적용하세요:

```bash
# Supabase DIRECT_URL로 마이그레이션 적용
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" npx prisma migrate deploy

# Prisma Client 생성
npx prisma generate
```

또는 Supabase SQL Editor에서 직접 마이그레이션 SQL을 실행할 수도 있습니다:

1. Supabase 대시보드 → "SQL Editor"
2. `prisma/migrations` 폴더의 마이그레이션 파일들을 순서대로 실행

### 4. 보안 확인

-   [x] 하드코딩된 비밀번호/API 키 없음
-   [x] 모든 보호된 API 라우트에 인증 체크 적용
-   [x] 갤러리 업로드/수정은 관리자만 가능
-   [x] `.env` 파일이 `.gitignore`에 포함됨

## Vercel 배포 단계

### 1. Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "Add New Project" 클릭
3. Git 저장소 선택 또는 연결

### 2. 프로젝트 설정

-   **Framework Preset**: Next.js
-   **Root Directory**: `./` (기본값)
-   **Build Command**: `npm run build` (자동 감지됨)
-   **Output Directory**: `.next` (자동 감지됨)
-   **Install Command**: `npm install` (기본값)

### 3. 환경 변수 설정

Vercel 대시보드의 "Settings" → "Environment Variables"에서 모든 필수 환경 변수를 추가하세요.

**중요**: 프로덕션, 프리뷰, 개발 환경 모두에 동일한 환경 변수를 설정하거나, 필요에 따라 환경별로 다르게 설정할 수 있습니다.

### 4. 배포

1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 후 도메인 확인

### 5. 배포 후 확인

배포가 완료된 후 다음을 확인하세요:

-   [ ] 홈페이지 로드 확인
-   [ ] 로그인/회원가입 기능 확인
-   [ ] 게시판 CRUD 기능 확인
-   [ ] 갤러리 이미지 업로드/표시 확인
-   [ ] 비밀글 기능 확인
-   [ ] 댓글 기능 확인

## 문제 해결

### 빌드 실패

1. 빌드 로그 확인
2. 환경 변수 누락 확인
3. TypeScript 오류 확인 (`npm run build` 로컬에서 실행)

### 데이터베이스 연결 오류

1. `DIRECT_URL` 환경 변수 확인
    - Supabase 연결 문자열 형식이 올바른지 확인
    - 비밀번호가 올바르게 설정되었는지 확인
2. Supabase 대시보드에서 연결 상태 확인
3. Supabase "Settings" → "Database" → "Connection pooling" 확인
    - Transaction 모드 사용 시: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
    - Session 모드 사용 시: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

### 이미지 업로드 실패

1. AWS S3 자격 증명 확인
2. S3 버킷 권한 확인
3. CloudFront 도메인 설정 확인

### 인증 오류

1. `NEXTAUTH_SECRET` 확인
2. `NEXTAUTH_URL`이 프로덕션 도메인과 일치하는지 확인
3. 쿠키 설정 확인 (프로덕션에서는 HTTPS 필수)

## 롤백 절차

문제가 발생한 경우:

1. Vercel 대시보드에서 이전 배포로 롤백
2. 또는 Git에서 이전 커밋으로 되돌리고 재배포

## 모니터링

-   Vercel 대시보드에서 배포 상태 및 로그 확인
-   에러 로그 모니터링
-   성능 메트릭 확인

## Supabase 추가 설정

### 연결 풀링 (Connection Pooling)

프로덕션 환경에서는 Supabase의 연결 풀링을 사용하는 것을 권장합니다:

1. Supabase 대시보드 → "Settings" → "Database"
2. "Connection pooling" 섹션에서 연결 문자열 복사
3. Transaction 모드 또는 Session 모드 선택
4. Vercel 환경 변수에 연결 문자열 설정

### 데이터베이스 백업

Supabase는 자동 백업을 제공합니다:

-   무료 플랜: 7일간 일일 백업
-   Pro 플랜: 7일간 일일 백업 + 주간 백업

수동 백업이 필요한 경우:

1. Supabase 대시보드 → "Database" → "Backups"
2. "Create backup" 클릭

### 환경 변수 예시

`.env.local` 파일 예시:

```env
# Supabase Database
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3 (이미지 업로드 사용 시)
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain.cloudfront.net"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"

# Optional
NEXT_PUBLIC_BASE_URL=""
NEXT_PUBLIC_KAKAO_KEY="your-kakao-map-api-key"
```

## 추가 리소스

-   [Vercel 문서](https://vercel.com/docs)
-   [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
-   [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
-   [Supabase 문서](https://supabase.com/docs)
-   [Supabase Prisma 가이드](https://supabase.com/docs/guides/integrations/prisma)
