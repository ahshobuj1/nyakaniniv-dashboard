export interface TLandingPageHero {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl1: string | null;
  imageUrl2: string | null;
  imageUrl3: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TLandingPageStep {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TLandingPageService {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TLandingPageFaq {
  id: number;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TLandingPageSocial {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  isActive: boolean;
  order: number;
}

export interface TLandingPageData {
  hero: TLandingPageHero | null;
  steps: TLandingPageStep[];
  services: TLandingPageService[];
  faqs: TLandingPageFaq[];
  socials: TLandingPageSocial[];
}

export interface TLandingPageResponse {
  success: boolean;
  message: string;
  data: TLandingPageData;
}
