This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

```
modu-hana-festival/
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── .env.local
├── .gitignore
│
├── src/
│   ├── app/                          # App Router (NextJS 15)
│   │   ├── globals.css
│   │   ├── layout.tsx               # Root Layout
│   │   ├── page.tsx                 # Home Page
│   │   ├── loading.tsx              # Global Loading UI
│   │   ├── error.tsx                # Global Error UI
│   │   ├── not-found.tsx            # 404 Page
│   │   │
│   │   ├── festival/                # 축제 소개
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── about/                   # 기관 소개
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── register/                # 사전참가 신청
│   │   │   ├── page.tsx
│   │   │   ├── success/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── online-festival/         # 온라인 축제
│   │   │   ├── page.tsx
│   │   │   ├── campaign/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── programs/                # 행사 프로그램
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── news/                    # 공지/소식
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── location/                # 오시는 길
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── gallery/                 # 갤러리
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── partners/                # 함께하는 기관
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   └── api/                     # API Routes (Mock Data)
│   │       ├── programs/
│   │       │   └── route.ts
│   │       ├── news/
│   │       │   └── route.ts
│   │       ├── register/
│   │       │   └── route.ts
│   │       ├── campaign/
│   │       │   └── route.ts
│   │       └── gallery/
│   │           └── route.ts
│   │
│   ├── components/                   # UI Components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   └── form.tsx
│   │   │
│   │   ├── layout/                  # Layout Components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── QuickBar.tsx
│   │   │
│   │   ├── home/                    # Home Page Components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FestivalOverview.tsx
│   │   │   ├── OnlineCampaign.tsx
│   │   │   ├── LatestNews.tsx
│   │   │   ├── LocationPreview.tsx
│   │   │   └── PartnersSlider.tsx
│   │   │
│   │   ├── forms/                   # Form Components
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── CampaignUpload.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   ├── programs/                # Program Components
│   │   │   ├── ProgramCard.tsx
│   │   │   ├── ProgramFilter.tsx
│   │   │   ├── ProgramDetail.tsx
│   │   │   └── MySchedule.tsx
│   │   │
│   │   ├── campaign/                # Campaign Components
│   │   │   ├── CampaignFeed.tsx
│   │   │   ├── HashtagChallenge.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   ├── QuizGame.tsx
│   │   │   └── ParticipationCounter.tsx
│   │   │
│   │   ├── gallery/                 # Gallery Components
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── ImageLightbox.tsx
│   │   │   └── YearFilter.tsx
│   │   │
│   │   ├── map/                     # Map Components
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── VenueMarkers.tsx
│   │   │   └── AccessibilityInfo.tsx
│   │   │
│   │   └── common/                  # Common Components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── SEOHead.tsx
│   │       ├── ShareButtons.tsx
│   │       ├── BackToTop.tsx
│   │       └── AccessibilitySkipLink.tsx
│   │
│   ├── hooks/                       # Custom Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useFavorites.ts
│   │   ├── useAnalytics.ts
│   │   └── useAccessibility.ts
│   │
│   ├── lib/                         # Utilities & Libraries
│   │   ├── utils.ts                 # Common utilities
│   │   ├── cn.ts                    # className utils
│   │   ├── validations.ts           # Form validations
│   │   ├── api.ts                   # API client
│   │   ├── analytics.ts             # GA4 functions
│   │   ├── accessibility.ts         # A11y helpers
│   │   └── constants.ts             # App constants
│   │
│   ├── types/                       # TypeScript Types
│   │   ├── index.ts
│   │   ├── program.ts
│   │   ├── registration.ts
│   │   ├── campaign.ts
│   │   ├── news.ts
│   │   └── gallery.ts
│   │
│   ├── data/                        # Mock JSON Data
│   │   ├── programs.json
│   │   ├── news.json
│   │   ├── partners.json
│   │   ├── gallery.json
│   │   ├── campaigns.json
│   │   └── venue-info.json
│   │
│   └── styles/                      # Additional Styles
│       ├── globals.css
│       ├── components.css
│       └── accessibility.css
│
├── public/                          # Static Assets
│   ├── images/
│   │   ├── hero/
│   │   ├── programs/
│   │   ├── gallery/
│   │   ├── partners/
│   │   └── icons/
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   └── manifest.json
│   └── maps/
│       └── venue-map.svg
│
└── docs/                           # Documentation
    ├── DEVELOPMENT.md
    ├── ACCESSIBILITY.md
    └── DEPLOYMENT.md
```