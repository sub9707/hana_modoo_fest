export interface Registration {
  id: string;
  name: string;
  phone: string;
  companions: number;
  programs: string[];
  registeredAt: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
  isActive: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
}

export interface Writing {
  id: string;
  title: string;
  author: string;
  content: string;
  topic: string;
  createdAt: string;
  views: number;
  likes: number;
  isSelected: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedAt: string;
  isBlurred: boolean;
  photographer?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  views: number;
}

export interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  path?: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  title: string;
  path: string;
}

export type RegistrationStatus = 'preparing' | 'active' | 'closed';