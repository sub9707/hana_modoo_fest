// src/types/index.ts
export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'official' | 'performance' | 'experience' | 'support-group' | 'solidarity';
  startTime: string;
  endTime: string;
  location: string;
  zone: string;
  boothNumber?: string;
  targetAudience: string[];
  capacity?: number;
  remainingSlots?: number;
  isBookingRequired: boolean;
  tags: string[];
  images: string[];
  organizer: string;
  contact?: string;
  requirements?: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    signLanguage: boolean;
    audioDescription: boolean;
  };
}

export interface RegistrationForm {
  name: string;
  phone: string;
  email: string;
  type: 'citizen' | 'single-parent' | 'support-group' | 'volunteer' | 'organization';
  accompaniedCount: number;
  interestedPrograms: string[];
  privacyConsent: boolean;
  marketingConsent: boolean;
  emergencyContact?: string;
  specialRequests?: string;
}

export interface CampaignPost {
  id: string;
  type: 'hashtag' | 'photo' | 'story';
  content: string;
  images?: string[];
  hashtags: string[];
  author: {
    nickname: string;
    isAnonymous: boolean;
  };
  createdAt: string;
  likes: number;
  isApproved: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'recruitment' | 'event' | 'winner' | 'venue-info' | 'safety';
  publishedAt: string;
  updatedAt: string;
  isPinned: boolean;
  images?: string[];
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
  tags: string[];
}

export interface Partner {
  id: string;
  name: string;
  type: 'host' | 'organizer' | 'sponsor' | 'cooperation' | 'participant';
  logoUrl: string;
  description?: string;
  website?: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  year: number;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  photographer?: string;
  copyrightInfo: string;
  uploadedAt: string;
}

export interface VenueInfo {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zones: {
    id: string;
    name: string;
    description: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    facilities: string[];
  }[];
  transportation: {
    subway: {
      station: string;
      line: string;
      walkingTime: number;
      exitNumber: string;
    }[];
    bus: {
      stopName: string;
      busNumbers: string[];
      walkingTime: number;
    }[];
    parking: {
      available: boolean;
      capacity: number;
      fee: string;
      restrictions: string[];
    };
  };
  accessibility: {
    wheelchairPath: string;
    elevators: string[];
    restrooms: string[];
    nursery: string[];
    medicalStation: string;
  };
}

export interface Analytics {
  pageView: (page: string) => void;
  ctaClick: (type: 'register' | 'participate' | 'location', location: string) => void;
  formSubmit: (type: 'registration' | 'volunteer' | 'organization') => void;
  campaignJoin: (type: 'hashtag' | 'photo' | 'quiz') => void;
  programFavorite: (programId: string) => void;
  mapOpen: (transportType: 'subway' | 'bus' | 'car') => void;
}