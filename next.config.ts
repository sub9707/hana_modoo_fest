import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost', 't1.kakaocdn.net', 'img1.kakaocdn.net','ssl.pstatic.net' ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.seoul.kr'
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net', // 네이버 프로필 이미지
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // 카카오 프로필 이미지
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net', // 카카오 프로필 이미지 (HTTPS)
      }
    ],

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
