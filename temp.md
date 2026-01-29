# 하나모두 대축제 (Hana Modoo Festival)

> 2025년 하나모두 대축제를 위한 온라인 축제 플랫폼

## 프로젝트 개요

**하나모두 대축제**는 시민들이 참여하는 온라인/오프라인 통합 축제 플랫폼입니다. 사전 등록, 퀴즈 이벤트, 룰렛 게임, 응원 댓글, 가족 글쓰기 등 다양한 참여형 콘텐츠와 관리자 대시보드를 통한 통합 운영 시스템을 제공합니다.

### 핵심 기능
- **사전 참가 신청**: 시민, 한부모, 자조모임, 봉사자, 기관 등 다양한 참가자 유형 지원
- **온라인 축제**: 퀴즈 이벤트, 룰렛 게임, 응원 댓글, 가족 글쓰기
- **관리자 대시보드**: 사용자 관리, 콘텐츠 관리, 통계 분석, 데이터 내보내기
- **인증 시스템**: 전화번호/이메일 인증, 네이버/카카오 OAuth 소셜 로그인
- **뉴스/공지**: Rich Text Editor를 통한 콘텐츠 작성 및 관리

---

## 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.5.9 | App Router 기반 풀스택 프레임워크 |
| **React** | 19.1.0 | UI 라이브러리 |
| **TypeScript** | 5.x | 정적 타입 시스템 |
| **Tailwind CSS** | 4.1.13 | 유틸리티 기반 스타일링 |
| **Framer Motion** | 12.23.22 | 애니메이션 |
| **React Hook Form** | 7.62.0 | 폼 상태 관리 |
| **Zod** | 4.1.11 | 스키마 검증 |

### Backend & Database
| 기술 | 버전 | 용도 |
|------|------|------|
| **MySQL** | - | mysql2 3.14.5, Connection Pool 기반 |
| **Redis** | 5.8.2 | 캐싱, Rate Limiting, 세션 |
| **Next.js API Routes** | - | RESTful API 서버 |

### 인증 & 보안
| 기술 | 용도 |
|------|------|
| **OAuth 2.0** | 네이버, 카카오 소셜 로그인 |
| **SMS 인증** | 전화번호 본인 인증 |
| **Brevo API** | 이메일 인증 및 알림 |
| **reCAPTCHA** | 봇 방지 |
| **Rate Limiting** | Redis 기반 요청 제한 |

### UI/UX 라이브러리
| 기술 | 용도 |
|------|------|
| **Tiptap** | Rich Text Editor (뉴스 작성) |
| **Recharts** | 관리자 통계 차트 |
| **Swiper** | 이미지 캐러셀/슬라이더 |
| **Lucide React** | 아이콘 시스템 |
| **Kakao Maps SDK** | 지도 및 주소 검색 |

### DevOps & 최적화
| 기술 | 용도 |
|------|------|
| **Turbopack** | 빠른 번들링 (개발 환경) |
| **Vercel** | 배포 및 호스팅 |
| **GitHub Actions** | CI/CD 파이프라인 |

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/            # 공개 페이지 그룹 (18개 페이지)
│   ├── (dashboard)/       # 관리자 대시보드
│   └── api/               # API 라우트 (76개 엔드포인트)
├── components/            # React 컴포넌트 (21개 카테고리)
├── lib/                   # 라이브러리 및 유틸리티
│   ├── mysql/            # MySQL 연결 풀 관리
│   ├── redis/            # Redis 캐싱 및 Rate Limiting
│   ├── auth/             # 인증 관련 유틸
│   ├── email/            # 이메일 서비스 (Brevo)
│   └── services/         # 비즈니스 로직
├── hooks/                 # 커스텀 React Hooks
├── types/                 # TypeScript 타입 정의 (12개)
├── contexts/              # React Context (AuthContext)
└── utils/                 # 공통 유틸리티 함수
```

---

## 주요 기능 상세

### 1. 인증 시스템

#### 다중 인증 방식 지원
```typescript
// 지원하는 가입 방식
type SignupMethod = 'phone' | 'naver' | 'kakao';
```

- **전화번호 가입**: SMS 인증 코드 발송 → 코드 검증 → 회원가입
- **소셜 로그인**: OAuth 2.0 기반 네이버/카카오 연동
- **이메일 인증**: 비밀번호 변경, 계정 복구 시 사용

#### 보안 기능
- 비밀번호 강도 검증 (대소문자, 숫자, 특수문자)
- Rate Limiting으로 무차별 대입 공격 방지
- 세션 토큰 기반 인증 상태 관리
- 계정 삭제 시 해시 기반 재가입 방지

### 2. 온라인 축제 기능

#### 퀴즈 이벤트
- 다양한 퀴즈 버전 지원
- 정답률 및 완료 시간 기록
- 참가자 통계 및 순위 시스템

#### 룰렛 게임 (랜덤 이벤트)
```typescript
// react-custom-roulette 기반 구현
- 상품 관리 (확률, 재고)
- 참가 제한 (일일 1회)
- 당첨자 자동 기록
```

#### 응원 댓글 & 가족 글쓰기
- 실시간 댓글 등록
- 좋아요 기능 (UUID 기반 중복 방지)
- 쿨다운 시스템 (스팸 방지)
- 관리자 검수 및 삭제 기능

### 3. 관리자 대시보드

#### 사용자 관리
- 전체 사용자 조회 (필터링, 검색)
- 역할 관리 (admin, user)
- 사용자 통계 (가입자 추이, 성별 분포)
- Excel 내보내기 (xlsx)

#### 콘텐츠 관리
- 뉴스/공지 CRUD (Tiptap Rich Editor)
- 온라인 축제 콘텐츠 관리
- 이벤트 상품 및 당첨자 관리

#### 통계 및 모니터링
- 일별 가입자 통계 차트
- 이벤트 참여 현황
- DB 연결 풀 상태 모니터링

---

## 최적화 및 성능

### 1. 데이터베이스 최적화

#### Connection Pool 관리
```typescript
// Vercel 환경 최적화 - 비용 67% 절감
const poolConfig = {
  connectionLimit: 10,        // 최적화된 연결 수
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000,
};
```

#### 슬로우 쿼리 모니터링
```typescript
// 150ms 이상 쿼리 자동 감지 및 로깅
if (duration > 150) {
  console.warn(`[SLOW QUERY] ${duration}ms: ${sql}`);
}
```

#### 트랜잭션 관리
```typescript
// 타임아웃 설정으로 데드락 방지
await connection.query('SET innodb_lock_wait_timeout = 5');
```

### 2. 이미지 최적화

```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],  // 최신 포맷 우선
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### 3. 캐싱 전략

```typescript
// 정적 자산 캐싱 (1년)
'/_next/static/:path*': 'public, max-age=31536000, immutable'

// 이미지/비디오 캐싱 (1주일)
'/images/:path*': 'public, max-age=604800'
'/videos/:path*': 'public, max-age=604800'

// API 응답 캐싱
'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
```

### 4. 번들 최적화

```typescript
// Turbopack 사용 (개발 환경)
// 패키지 최적화
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'framer-motion',
    'recharts',
    'swiper',
    '@tiptap/react'
  ],
}
```

### 5. Rate Limiting

```typescript
// Redis 기반 요청 제한
- API 엔드포인트별 제한
- IP 기반 추적
- 윈도우 슬라이딩 알고리즘
```

---

## API 설계

### API 엔드포인트 (76개)

#### 인증 API (15개)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |
| POST | `/api/auth/oauth/naver` | 네이버 OAuth |
| POST | `/api/auth/oauth/kakao` | 카카오 OAuth |
| POST | `/api/auth/send-verification` | 인증 코드 발송 |
| POST | `/api/auth/verify-code` | 인증 코드 검증 |
| POST | `/api/auth/forgot-password` | 비밀번호 찾기 |
| POST | `/api/auth/reset-password` | 비밀번호 재설정 |

#### 관리자 API (17개)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/users` | 사용자 목록 조회 |
| PATCH | `/api/admin/users/[id]` | 사용자 정보 수정 |
| DELETE | `/api/admin/users/[id]` | 사용자 삭제 |
| GET | `/api/admin/users/export` | 사용자 데이터 내보내기 |
| GET | `/api/admin/event/stats` | 이벤트 통계 |
| POST | `/api/admin/event/prizes` | 상품 관리 |

#### 이벤트 API (5개)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/event/prizes` | 상품 목록 |
| POST | `/api/event/roulette/spin` | 룰렛 스핀 |
| GET | `/api/event/participation/check` | 참가 여부 확인 |
| GET | `/api/event/winners` | 당첨자 목록 |

### API 응답 표준화

```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// 에러 응답
interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// 페이지네이션 응답
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 컴포넌트 아키텍처

### 디렉토리 구조 (21개 카테고리)
```
components/
├── ui/              # 기본 UI 컴포넌트 (Button, Input, Modal 등)
├── common/          # 공통 컴포넌트 (LoadingSpinner, Carousel)
├── layout/          # 레이아웃 (Header, Footer, Navigation)
├── auth/            # 인증 관련 (LoginForm, RegisterForm)
├── forms/           # 폼 컴포넌트 (AddressSearch, FileUpload)
├── admin/           # 관리자 전용 컴포넌트
├── home/            # 홈페이지 섹션
├── online-festival/ # 온라인 축제 (Quiz, Roulette, Comments)
├── news/            # 뉴스 컴포넌트
└── ...              # 기타 페이지별 컴포넌트
```

### 상태 관리

```typescript
// AuthContext - 전역 인증 상태
const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}>(null);

// React Hook Form + Zod - 폼 상태
const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(schema),
});
```

### 커스텀 Hooks

```typescript
// useUser - 사용자 정보 관리
const { user, isLoading, error, refetch } = useUser();

// useQuiz - 퀴즈 상태 관리
const { questions, currentIndex, submitAnswer } = useQuiz();

// useInfiniteScroll - 무한 스크롤
const { items, loadMore, hasMore } = useInfiniteScroll(fetchFn);

// useCooldown - 쿨다운 관리
const { canSubmit, remainingTime } = useCooldown(duration);
```

---

## 타입 시스템

### 핵심 타입 정의 (12개 파일)

```typescript
// User 타입
interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female';
  birth_date: string;
  address?: string;
  zip_code?: string;
  profile_image?: string;
  role: 'admin' | 'user';
  signup_method: 'phone' | 'naver' | 'kakao';
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// Registration 타입
interface Registration {
  id: number;
  user_id: number;
  participant_type: 'citizen' | 'single-parent' | 'self-help' | 'volunteer' | 'organization';
  companions: number;
  companion_details?: CompanionDetail[];
  status: 'confirmed' | 'pending' | 'cancelled';
}

// QuizParticipant 타입
interface QuizParticipant {
  id: number;
  user_id: number;
  quiz_version: string;
  perfect_score: boolean;
  correct_answers: number;
  total_questions: number;
  completion_time: number;
}
```

---

## 보안 구현

### 인증 보안
- **비밀번호 해싱**: bcrypt 기반 단방향 암호화
- **세션 토큰**: UUID 기반 랜덤 토큰 생성
- **토큰 만료**: 자동 세션 만료 처리

### API 보안
- **Rate Limiting**: Redis 기반 요청 제한
- **인증 미들웨어**: API 라우트 보호
- **입력 검증**: Zod 스키마 검증

### 데이터 보안
- **SQL Injection 방지**: Prepared Statements 사용
- **XSS 방지**: React 자동 이스케이프
- **CORS 설정**: 허용된 도메인만 접근

### 계정 보안
- **재가입 방지**: 삭제된 계정 해시 저장
- **블랙리스트**: 악성 사용자 차단
- **IP 추적**: 보안 이벤트 로깅

---

## 프로젝트 하이라이트

### 기술적 성과

1. **풀스택 개발**
   - Next.js 15 App Router 기반 SSR/CSR 하이브리드
   - 76개 API 엔드포인트 설계 및 구현
   - TypeScript 기반 완전한 타입 안전성

2. **성능 최적화**
   - MySQL Connection Pool 최적화 (Vercel 비용 67% 절감)
   - 이미지 최적화 (AVIF/WebP 자동 변환)
   - 슬로우 쿼리 모니터링 시스템

3. **확장 가능한 아키텍처**
   - 모듈화된 컴포넌트 구조 (21개 카테고리)
   - 재사용 가능한 커스텀 Hooks
   - 표준화된 API 응답 형식

4. **보안 시스템**
   - 다중 인증 방식 (전화번호, OAuth)
   - Redis 기반 Rate Limiting
   - 완전한 인증 플로우 구현

### 비즈니스 가치

1. **사용자 경험**
   - 직관적인 축제 참가 신청 프로세스
   - 다양한 참여형 이벤트 (퀴즈, 룰렛, 글쓰기)
   - 반응형 디자인으로 모바일 최적화

2. **운영 효율성**
   - 통합 관리자 대시보드
   - 실시간 통계 및 모니터링
   - Excel 데이터 내보내기

3. **확장성**
   - 다양한 참가자 유형 지원
   - 유연한 이벤트 관리 시스템
   - 다국어 지원 준비 (i18n)

---

## 기술적 도전과 해결

### 1. Connection Pool 최적화
**문제**: Vercel Serverless 환경에서 DB 연결 비용 증가
**해결**: 연결 풀 크기 최적화, 연결 재사용 전략, 헬스 체크 구현

### 2. 실시간 이벤트 처리
**문제**: 동시 다발적인 룰렛 스핀 요청 처리
**해결**: Redis 기반 참가 제한, 트랜잭션 처리, 재고 동기화

### 3. 사용자 인증 통합
**문제**: 다양한 인증 방식 (전화번호, OAuth) 통합 관리
**해결**: 통합 User 모델, 인증 컨텍스트 설계, 세션 토큰 관리

### 4. 관리자 대시보드 성능
**문제**: 대량 데이터 조회 및 표시 성능
**해결**: 페이지네이션, 가상 스크롤, 지연 로딩

---

## 개발 환경 및 도구

### 개발 명령어
```bash
npm run dev      # 개발 서버 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

### 환경 변수
```env
# Database
MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE

# OAuth
NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET

# Services
BREVO_API_KEY, BREVO_SENDER_EMAIL
RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY
```

---

## 프로젝트 규모

| 항목 | 수량 |
|------|------|
| API 엔드포인트 | 76개 |
| 페이지 | 25개+ |
| 컴포넌트 카테고리 | 21개 |
| 타입 정의 파일 | 12개 |
| 커스텀 Hooks | 10개+ |

---

## 스크린샷

> 실제 스크린샷을 추가하세요

- 메인 페이지
- 사전 등록 페이지
- 온라인 축제 (퀴즈/룰렛)
- 관리자 대시보드
- 사용자 통계 차트

---

## 향후 개선 계획

1. **성능 개선**
   - React Server Components 활용 확대
   - 이미지 CDN 최적화
   - 캐싱 전략 고도화

2. **기능 확장**
   - 실시간 알림 시스템
   - 푸시 알림 (PWA)
   - 다국어 지원 완성

3. **운영 개선**
   - 로그 수집 및 분석
   - 에러 모니터링 (Sentry)
   - A/B 테스팅 시스템

---

## 라이선스

Private Project - All Rights Reserved

---

*이 문서는 포트폴리오 참고용으로 작성되었습니다.*
