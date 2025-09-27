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
    submenu: [
      { id: 'registration', title: '사전접수', path: '/admin/registration' },
      { id: 'quiz', title: '퀴즈이벤트', path: '/admin/quiz' },
      { id: 'comments', title: '응원댓글', path: '/admin/comments' },
      { id: 'writing', title: '가족주제 글짓기', path: '/admin/writing' },
      { id: 'random-event', title: '랜덤이벤트', path: '/admin/random-event' }
    ]
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