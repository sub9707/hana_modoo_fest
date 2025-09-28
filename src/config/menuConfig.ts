// config/menuConfig.ts
import { 
  BarChart3, 
  Users, 
  Bell, 
  Image, 
  UserCheck
} from 'lucide-react';
import { MenuItem } from '@/types/admin';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'GA4 통계',
    icon: BarChart3,
    path: '/admin/dashboard'
  },
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
  }
];