// config/menuConfig.ts
import {
  Users,
  Bell,
  Settings,
  UserCheck
} from 'lucide-react';
import { MenuItem } from '@/types/admin';

export const menuItems: MenuItem[] = [
  {
    id: 'online-festival',
    title: '온라인 축제',
    icon: Users,
    path: '/admin/online-festival'
  },
  {
    id: 'news',
    title: '공지 관리',
    icon: Bell,
    path: '/admin/news'
  },
  {
    id: 'users',
    title: '회원 관리',
    icon: UserCheck,
    path: '/admin/users'
  },
  {
    id: 'settings',
    title: '기타 설정',
    icon: Settings,
    submenu: [
      {
        id: 'settings/weather-banner',
        title: '날씨 배너 설정',
        path: '/admin/settings/weather-banner'
      }
    ]
  }
];
