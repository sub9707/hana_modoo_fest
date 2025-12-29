import localFont from 'next/font/local'

export const paperlogy = localFont({
  src: [
    {
      path: '../../public/fonts/Paperlogy-4Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Paperlogy-7Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-paperlogy',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
})