/**
 * 애플리케이션 라우트 경로 상수
 */
export const ROUTES = {
  // 메인 페이지
  home: '/',

  // 사이트 페이지
  about: '/about',
  organization: '/organization',
  onlineFestival: '/online-festival',
  programs: '/programs',
  news: '/news',
  directions: '/directions',
  partners: '/partners',
  gallery: '/gallery',
  contact: '/contact',

  // 인증 관련
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  // 사용자 관련
  registration: '/registration',
  registrationSuccess: '/registration/success',
  myPage: '/my-page',
  changePassword: '/my-page/change-password',
  changePasswordOptions: '/my-page/change-password-options',
  changePasswordWithEmail: '/my-page/change-password-with-email',
  deleteAccount: '/my-page/delete-account',
  accountDeleted: '/account-deleted',

  // 법적 페이지
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',

  // 에러 페이지
  unauthorized: '/unauthorized',

  // 관리자 페이지
  admin: {
    home: '/admin',
    onlineFestival: '/admin/online-festival',
    news: '/admin/news',
    users: '/admin/users',
    settings: {
      weatherBanner: '/admin/settings/weather-banner',
    },
  },

  // API 경로
  api: {
    campaignStats: '/api/campaign/stats',
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      register: '/api/auth/register',
    },
  },
} as const

export type Routes = typeof ROUTES
