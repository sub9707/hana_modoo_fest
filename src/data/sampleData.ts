import { User, Registration, Quiz, Comment, Writing, GalleryPhoto, Notice } from '@/types/admin';

export const sampleUsers: User[] = [
  { id: '1', name: '김철수', email: 'kim@example.com', phone: '010-1234-5678', registeredAt: '2024-09-10', status: 'active' },
  { id: '2', name: '이영희', email: 'lee@example.com', phone: '010-2345-6789', registeredAt: '2024-09-11', status: 'active' },
  { id: '3', name: '박민수', email: 'park@example.com', phone: '010-3456-7890', registeredAt: '2024-09-12', status: 'inactive' }
];

export const sampleRegistrations: Registration[] = [
  { 
    id: '1', 
    name: '김가족', 
    email: 'family@example.com', 
    phone: '010-1111-2222', 
    companions: 3, 
    programs: ['공연관람', '체험부스'], 
    registeredAt: '2024-09-13' 
  },
  { 
    id: '2', 
    name: '이가족', 
    email: 'lee@example.com', 
    phone: '010-3333-4444', 
    companions: 2, 
    programs: ['자조모임'], 
    registeredAt: '2024-09-14' 
  }
];

export const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    question: '우리나라에서 한부모가족의 비율은?',
    options: ['약 5%', '약 10%', '약 15%', '약 20%'],
    correctAnswer: 1,
    category: '가족통계',
    explanation: '통계청 자료에 따르면 약 10%입니다.',
    isActive: true
  },
  {
    id: '2',
    question: '가족의 형태가 다양해지는 현상을 무엇이라고 할까요?',
    options: ['가족해체', '가족다양성', '가족위기', '가족갈등'],
    correctAnswer: 1,
    category: '가족개념',
    explanation: '현대사회에서 나타나는 다양한 가족 구성을 "가족다양성"이라고 합니다.',
    isActive: true
  }
];

export const sampleComments: Comment[] = [
  { id: '1', author: '응원자1', content: '축제 너무 기대돼요!', createdAt: '2024-09-13', isApproved: true },
  { id: '2', author: '가족사랑', content: '모든 가족이 행복하길 바라요', createdAt: '2024-09-14', isApproved: false },
  { id: '3', author: '축제참가자', content: '작년에 참가했는데 정말 좋았어요', createdAt: '2024-09-15', isApproved: true }
];

export const sampleWritings: Writing[] = [
  {
    id: '1',
    title: '우리 가족만의 특별한 전통',
    author: '김○○',
    content: '매주 일요일 아침 팬케이크를 만드는 우리 가족의 특별한 시간...',
    topic: '가족 전통',
    createdAt: '2024-09-12',
    views: 127,
    likes: 34,
    isSelected: true
  },
  {
    id: '2',
    title: '엄마와 나, 둘만의 여행',
    author: '이○○',
    content: '한부모 가족이지만 우리는 충분히 행복해요...',
    topic: '가족 여행',
    createdAt: '2024-09-13',
    views: 89,
    likes: 22,
    isSelected: false
  }
];

export const samplePhotos: GalleryPhoto[] = [
  {
    id: '1',
    title: '2024 개막식',
    description: '축제 개막식 현장',
    category: '개막식',
    uploadedAt: '2024-09-10',
    isBlurred: true,
    photographer: '서울시한부모가족지원센터'
  },
  {
    id: '2',
    title: '아이들 체험 활동',
    description: '다양한 체험 프로그램을 즐기는 아이들',
    category: '체험부스',
    uploadedAt: '2024-09-11',
    isBlurred: false
  },
  {
    id: '3',
    title: '가족 사진 촬영',
    description: '가족 단위 참가자들의 기념 촬영',
    category: '순간포착',
    uploadedAt: '2024-09-12',
    isBlurred: true
  }
];

export const sampleNotices: Notice[] = [
  {
    id: '1',
    title: '모두하나대축제 개최 안내',
    content: '2024년 모두하나대축제가 여의도공원에서 개최됩니다...',
    category: '공지사항',
    isPublished: true,
    createdAt: '2024-09-10',
    views: 234
  },
  {
    id: '2',
    title: '사전참가 신청 접수 시작',
    content: '사전참가 신청 접수가 시작되었습니다...',
    category: '모집공고',
    isPublished: true,
    createdAt: '2024-09-08',
    views: 456
  }
];