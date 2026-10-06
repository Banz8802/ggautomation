import rawCareersData from './careers.json';

export interface CareersPageSettings {
  badge: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  posterImage?: string;
  applicationEmail: string;
  location: string;
  headline: string;
  generalRequirements: string[];
  applicationInstructions: string;
}

export interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Open' | 'Closed';
  experience: string;
  preference?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  tags: string[];
  bannerImage?: string;
  image?: string;
}

export interface CareersData {
  pageSettings: CareersPageSettings;
  jobs: JobItem[];
}

export const initialCareersData: CareersData = {
  pageSettings: {
    badge: rawCareersData.pageSettings?.badge || 'WE ARE HIRING!',
    title: rawCareersData.pageSettings?.title || 'Join Our Growing Team & Build Your Career in Clean Energy',
    subtitle:
      rawCareersData.pageSettings?.subtitle ||
      "Looking for a start of your career opportunity? We're expanding our team and looking for motivated, hardworking, and passionate individuals to join us!",
    bannerImage: rawCareersData.pageSettings?.bannerImage || '/images/hero-career.webp',
    posterImage: rawCareersData.pageSettings?.posterImage || '',
    applicationEmail: rawCareersData.pageSettings?.applicationEmail || 'Info@ggautomation.tech',
    location: rawCareersData.pageSettings?.location || 'Cebu City, Philippines',
    headline:
      rawCareersData.pageSettings?.headline ||
      'Be part of our team in helping build a cleaner, brighter, and more sustainable future through solar energy!',
    generalRequirements: Array.isArray(rawCareersData.pageSettings?.generalRequirements)
      ? rawCareersData.pageSettings.generalRequirements
      : [
          'Excellent at communication and interpersonal skills',
          'Responsible and organized',
          'Willing to learn and grow',
          'Team-oriented and hardworking',
          'Preferably female and resident of Cebu City',
        ],
    applicationInstructions:
      rawCareersData.pageSettings?.applicationInstructions ||
      'For interested applicants: Send your updated resume to Info@ggautomation.tech — Your career opportunity could start at one application away!',
  },
  jobs: (rawCareersData.jobs as JobItem[]) || [],
};
