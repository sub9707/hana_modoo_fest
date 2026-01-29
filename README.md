# 하나모두 대축제 - 포트폴리오

## 프로젝트 개요

**프로젝트명:** 2025 하나모두 대축제 웹 플랫폼

**유형:** 풀스택 웹 애플리케이션 (프론트엔드 + 백엔드 API + 관리자 대시보드)

**개발 기간:** 2025년

**배포 환경:** Vercel (pro) + 외부 DB (가비아)

> 온/오프라인 축제 참여, 사전등록, 온라인 이벤트(퀴즈, 룰렛, 응원글, 글쓰기), 뉴스/공지, 관리자 대시보드까지 포함하는 종합 축제 플랫폼

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 15 (App Router), React 19, TypeScript |
| **스타일링** | Tailwind CSS 4, Framer Motion |
| **폼/검증** | React Hook Form, Zod |
| **전역 상태관리** | React Context API |
| **데이터베이스** | MySQL (mysql2 커넥션 풀) |
| **캐싱** | Redis (Rate Limiting, 세션) |
| **인증** | 자체 세션 + OAuth 2.0 (네이버, 카카오) |
| **외부 API** | Kakao Maps, Brevo(이메일), NCP SENS(SMS) |
| **에디터** | Tiptap (Rich Text Editor) |
| **차트** | Recharts |
| **번들러** | Turbopack |
| **배포** | Vercel |

---

## 핵심 기능

### 1. 사용자 사이트 (22개 페이지)

[이미지 및 상세 확인 (외부앱 이동)](http://subdevpi.mywire.org:5000/pages)

- **홈페이지** - 히어로 영상, 축제 소개, 프로그램, 캠페인 통계
- **온라인 축제** - 퀴즈, 룰렛 이벤트, 응원 댓글, 가족 글쓰기 (탭 기반 SPA)
- **사전참가 신청** - 다단계 폼 + Kakao 주소 검색 연동
- **뉴스/공지** - 카테고리별 필터, 상세 페이지
- **갤러리** - 이미지 그리드 + 라이트박스
- **오시는 길** - Kakao Maps SDK 연동
- **마이페이지** - 프로필, 비밀번호 변경, 계정 삭제
- **인증** - 로그인, 회원가입, 비밀번호 찾기, OAuth

### 2. 관리자 대시보드

- **사용자 관리** - 검색/필터, 역할 변경, Excel 내보내기, 통계 차트
- **뉴스 관리** - Tiptap WYSIWYG 에디터로 작성/수정/삭제
- **온라인 축제 관리** - 퀴즈 참가자, 응원 댓글, 글쓰기, 당첨자 관리
- **이벤트 관리** - 룰렛 상품 설정, 통계
- **설정** - 날씨 배너 관리

### 3. REST API (76개 엔드포인트)
[REST API상세 확인 (외부앱 이동)](http://subdevpi.mywire.org:5000/apis)
- **인증 API** (15개) - 회원가입, 로그인, OAuth, SMS/이메일 인증, 비밀번호 재설정
- **관리자 API** (17개) - 사용자/콘텐츠 CRUD, 데이터 내보내기
- **이벤트 API** (5개) - 룰렛, 상품, 참여 확인, 당첨자
- **퀴즈 API** (4개) - 참가 등록/조회, 상태 확인
- **커뮤니티 API** (6개) - 글쓰기, 응원 댓글, 좋아요
- **뉴스 API** (3개) - 목록, 상세, 카테고리
- **기타 API** (9개) - 사전등록, 캠페인 통계, 헬스체크

---

## 아키텍처 및 설계

### App Router 기반 라우트 그룹

```
src/app/
├── (site)/          # 사용자 사이트 (Route Group)
├── (dashboard)/     # 관리자 대시보드 (Route Group)
└── api/             # REST API 엔드포인트
```

- `(site)`, `(dashboard)` Route Group으로 레이아웃 분리
- 사용자/관리자 페이지가 각각 독립된 레이아웃 사용

### Server Component / Client Component 분리

```tsx
// Server Component - 서버에서 데이터 직접 패칭
export default async function JoinCampaignsSection() {
  const stats = await getCampaignStatsData()
  return <StatsDisplay data={stats} />
}

// Client Component - 인터랙션이 필요한 경우만
'use client'
export default function OnlineFestivalTabs() {
  const [activeTab, setActiveTab] = useState('registration')
  return <TabUI />
}
```

### 컴포넌트 계층 구조

```
Root Layout → Provider (Auth 등)
├── Header / Footer (레이아웃 UI)
├── Page (Server Component)
│   ├── Section Components (서버/클라이언트 혼합)
│   │   └── UI Components
│   └── Form Components (react-hook-form)
└── Admin Layout → Sidebar + Content
```


## 기타 세부 사항

### 1. 성능 최적화

**Dynamic Import로 초기 로딩 최적화**
```tsx
const Introduction = dynamic(() => import('@/components/home/Introduction'), {
  loading: () => <div className="min-h-80 bg-[#885ef9]" />
})
```
- 홈페이지 6개 섹션 중 히어로를 제외한 5개를 Lazy Loading
- 각 섹션에 색상 매칭 스켈레톤 제공으로 CLS(Layout Shift) 방지
- 관리자 페이지는 모두 lazy load하여 초기 로드 부하 방지

**이미지 최적화**
- Next.js Image 컴포넌트 + `sizes` 속성으로 뷰포트별 적정 크기 로드
- AVIF/WebP 자동 포맷 변환 (`next.config.ts`에서 설정)
- `quality={85}`로 용량/품질 균형

**번들 최적화**
```ts
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'swiper', '@tiptap/react']
}
```
- 대형 라이브러리 트리쉐이킹 최적화
- Turbopack 번들러 사용

**캐싱 전략**
- 정적 자산 1년 캐시 (`max-age=31536000, immutable`)
- 폰트 파일 1년 캐시

### 2. MySQL 커넥션 풀 관리

```ts
// Vercel 서버리스 환경에 최적화된 커넥션 풀
const pool = mysql.createPool({
  connectionLimit: 10,    // Vercel 비용 절감
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true
})
```
- **트랜잭션 타임아웃** (5초)

### 3. 인증 시스템

**다중 인증 방식 지원**
- 전화번호 + 비밀번호 (자체 가입)
- 네이버 OAuth 2.0

**보안 계층**
- Redis 기반 Rate Limiting (API별 요청 제한)
- SMS 인증 코드 발송 (NCP SENS)
- 이메일 인증 코드 발송 (Brevo API)
- 세션 토큰 기반 인증 (`httpOnly` 쿠키)
- reCAPTCHA 통합
- 비밀번호 강도 검증 정책
- IP 추적 및 보안 이벤트 로깅
- 계정 삭제 시 blacklist + 해시 기록 보존

**AuthContext를 통한 전역 인증 상태**
```tsx
const { user, isLoading, login, logout, refreshUser } = useAuth()
```
- 마운트 시 자동 세션 복원 (`/api/auth/me`)
- 재시도 로직 (최대 2회)
- AbortSignal 타임아웃 처리


### 4. 반응형 디자인 (Mobile-First)

**3단계 반응형 탭 시스템** (온라인 축제)
```tsx
{/* 데스크톱: 가로 전체 탭 */}
<div className="hidden md:flex">...</div>

{/* 태블릿: 스크롤 가능한 축약 탭 */}
<div className="hidden sm:flex md:hidden">...</div>

{/* 모바일: 2줄 그리드 배치 */}
<div className="sm:hidden">...</div>
```

**반응형 그리드**
- 모바일 1열 → 태블릿 2열 → 데스크톱 3열
- 갭, 폰트 크기, 패딩 모두 브레이크포인트별 조정
- 헤더: xl 기준 데스크톱 네비게이션 ↔ 모바일 햄버거 메뉴


### 5. API 설계

**계층화된 API 구조**
```
lib/api/
├── auth-middleware.ts   # 인증 미들웨어
├── response-builder.ts  # 표준화된 응답 포맷
├── error-handler.ts     # 중앙 에러 처리
├── rate-limit.ts        # Rate Limiting
└── index.ts
```

**표준화된 응답**
```ts
// 모든 API가 동일한 응답 구조 사용
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### 6. 관리자 대시보드

- **사용자 통계 차트** - Recharts로 가입 추이 등 시각화
- **데이터 내보내기** - xlsx 라이브러리로 Excel 파일 생성/다운로드
- **Tiptap WYSIWYG 에디터** - 텍스트 에디터 적용

---

## 커스텀 훅

| Hook | 기능 |
|------|------|
| `useAuth()` | 전역 인증 상태 (로그인, 로그아웃, 세션 복원) |
| `useUser()` | 사용자 정보 관리 |
| `useQuiz()` | 퀴즈 참가 로직 |
| `useInfiniteScroll()` | 무한 스크롤 페이징 |
| `useIntersectionObserver()` | 뷰포트 교차 감지 (Lazy Loading) |
| `useKakaoLoader()` | Kakao Maps SDK 동적 로딩 |
| `useWritingForm()` | 글쓰기 폼 상태 관리 |
| `useCooldown()` | 글쓰기 쿨다운 타이머 |
| `useAbortController()` | API 요청 취소 관리 |
| `useLoadingPrevention()` | 중복 요청 방지 |

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 페이지 | 22개 (사용자) + 5개 (관리자) |
| API 엔드포인트 | 76개 |
| 컴포넌트 | 21개 카테고리, 100+ 파일 |
| 커스텀 훅 | 10+ |
| TypeScript 타입 정의 | 12개 모듈 |
| 외부 API 연동 | (Daum, Naver, Brevo) |

---

## 주요 기술적 도전과 해결

### 1. 서버리스 환경의 DB 커넥션 관리
- **문제:** Vercel 서버리스에서 매 요청마다 새 커넥션 생성 시 비용/성능 문제
- **해결:** 커넥션 풀 최적화 (10개 제한), Keep-Alive 활성화, 슬로우 쿼리 모니터링

### 2. OAuth + 자체 인증 통합
- **문제:** 네이버 OAuth와 자체 전화번호 인증을 하나의 세션으로 통합
- **해결:** 통합 User 모델에 `signup_method` 필드, AuthContext에서 일관된 인터페이스 제공

### 3. 룰렛 이벤트 동시성 제어
- **문제:** 동시에 여러 사용자가 룰렛 스핀 시 상품 재고 초과 문제
- **해결:** Redis 기반 동시성 제어, 서버에서 먼저 결과 결정 후 클라이언트 애니메이션

### 4. 대규모 폼 성능
- **문제:** 등록 폼 필드, 실시간 검증 시 잦은 리렌더링
- **해결:** React Hook Form의 비제어 컴포넌트 패턴으로 필요한 필드만 리렌더링

### 5. 서버 세션 인증 기반 유저 관리 및 악성 사용자 대응

**배경:**
사업자 전화번호 이슈와 촉박한 일정으로 인해 SMS 인증 시스템을 초기 도입하지 못하고, 이메일 인증만으로 회원가입을 진행

**악성 봇 패턴 발견 및 대응:**
- 서비스 운영 중 동일 IP 가입, 동일한 패턴의 ID 등 악성 행위를 감지
- 아래 기준으로 자동화된 악성 패턴을 탐지
  - 24시간 내 동일 IP에서 10회 이상 가입 시도
  - 계정 생성 후 1시간 이내 탈퇴를 3회 이상 반복
  - 월 3회 이상 탈퇴 또는 누적 5회 이상 탈퇴 시 블랙리스트 자동 등록
- 악의적 패턴이 확인된 사용자의 **세션을 모조리 중단**(DB의 `session_token`, `session_expires_at` NULL 처리)시키고 해당 계정을 제거
- 제재 대상 사용자를 위한 **이의제기 UI 컴포넌트**를 추가하여, 오탐으로 인한 피해를 방지할 수 있는 경로를 제공

**공식 이메일 도메인 화이트리스트 도입:**
- 이후 공식 이메일 도메인(Gmail, Naver, Daum 등)으로만 가입을 받도록 화이트리스트 방식으로 전환
- `allowed_email_domains` 테이블에서 `is_active = 1`인 도메인만 허용하고, 미등록 도메인은 가입 단계에서 차단
- 회원가입 UI에서 **허용 도메인 안내 문구**를 노출하여, 사용자가 사전에 가입 가능한 이메일을 확인할 수 있도록 안내

**관련 구현:**
- 세션: DB 컬럼(`session_token`, `session_expires_at`) 기반 서버 세션 + `httpOnly` 쿠키, 7일 만료, 다른 기기 로그인 시 기존 세션 자동 무효화
- 패턴 분석: `signup_deletion_patterns`, `user_blacklist`, `account_deletions` 테이블로 가입/탈퇴 이력 추적
- 화이트리스트: `email-whitelist-checker.ts`에서 도메인 검증 후 인증 코드 발송 차단
