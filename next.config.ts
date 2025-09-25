import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'http', hostname: 'localhost' },
    { protocol: 'https', hostname: 't1.kakaocdn.net' },
    { protocol: 'https', hostname: 'img1.kakaocdn.net' },
    { protocol: 'https', hostname: 'ssl.pstatic.net' }, // 네이버 프로필 이미지
    { protocol: 'http', hostname: 'k.kakaocdn.net' },   // 카카오 (HTTP)
    { protocol: 'https', hostname: 'k.kakaocdn.net' },  // 카카오 (HTTPS)
    { protocol: 'https', hostname: '**.seoul.kr' },     // 서울시 도메인
  ],
},
  eslint:{
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  }
};

export default nextConfig;
