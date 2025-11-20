
export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  DESTINATIONS = 'DESTINATIONS',
  BOOKING = 'BOOKING',
  CONTACT = 'CONTACT',
  MOCK_TEST = 'MOCK_TEST',
  NOTIFICATIONS = 'NOTIFICATIONS',
  RESOURCES = 'RESOURCES',
  UK_INTERVIEW = 'UK_INTERVIEW',
  NEPALI_CALENDAR = 'NEPALI_CALENDAR'
}

export type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'rose';

export interface AppTheme {
  mode: 'light' | 'dark';
  color: ThemeColor;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export interface University {
  name: string;
  website?: string;
  location?: string;
  address?: string;
  mapLink?: string;
  image?: string;
  tuitionFee?: string;
  scholarship?: string;
  intake?: string;
  casDeposit?: string;
  remarks?: string;
  details?: {
    ugCourses?: string[];
    pgCourses?: string[];
    ugRequirements?: string[];
    pgRequirements?: string[];
    extra?: string;
  };
}

export interface Destination {
  id: string;
  country: string;
  image: string;
  details: string;
  universities: University[];
}

export interface Testimonial {
  id: string;
  name: string;
  university: string;
  country: string;
  quote: string;
  image: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'offer' | 'deadline' | 'update';
}
