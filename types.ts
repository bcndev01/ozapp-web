
export type Language = 'en' | 'tr';

export interface LocalizedText {
  en: string;
  tr: string;
}

export interface Feature {
  title: LocalizedText;
  description: LocalizedText;
  iconName: string; // Changed from Component to string for storage
}

export interface PolicySection {
  title: LocalizedText;
  content: LocalizedText;
}

export interface AppData {
  id: string;
  name: string; 
  tagline: LocalizedText;
  description: LocalizedText;
  iconUrl: string;
  screenshots: string[];
  features: Feature[];
  downloadLink: string;
  category: LocalizedText;
  rating: number;
  reviewsCount: number;
  version: string;
  lastUpdated: LocalizedText;
  privacyPolicy: PolicySection[];
}
