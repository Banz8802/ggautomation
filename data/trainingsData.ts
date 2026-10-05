import rawTrainingsData from './trainings.json';

export type TrainingCategory =
  | 'All'
  | 'Featured Milestone'
  | 'Specialized Track'
  | 'EPC Core'
  | 'Safety & Compliance'
  | 'Regulatory & Utility'
  | 'Hands-on Workshop'
  | 'Other';

export interface TrainingRawInput {
  id: string;
  title: string;
  category?: string;
  badge?: string;
  date?: string;
  location?: string;
  organizer?: string;
  videoUrl?: string;
  image?: string;
  gallery?: string | string[];
  description?: string;
  topics?: string[];
  targetAudience?: string;
  registrationUrl?: string;
  tags?: string[];
}

export interface TrainingItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  date: string;
  location: string;
  organizer: string;
  videoUrl: string;
  image: string;
  gallery: string[];
  description: string;
  topics: string[];
  targetAudience: string;
  registrationUrl: string;
  tags: string[];
}

export function normalizeTrainingGallery(galleryInput?: string | string[], fallbackImage?: string): string[] {
  let list: string[] = [];

  if (typeof galleryInput === 'string') {
    list = galleryInput
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
  } else if (Array.isArray(galleryInput)) {
    list = galleryInput.map((img) => img.trim()).filter((img) => img.length > 0);
  }

  if (list.length === 0 && fallbackImage) {
    list = [fallbackImage];
  }

  return list.length > 0 ? list : ['/images/hero-floating-solar.jpg'];
}

export function parseRawTrainings(rawData: TrainingRawInput[]): TrainingItem[] {
  return rawData.map((raw, idx) => {
    const defaultCover = raw.image || '/images/hero-floating-solar.jpg';
    return {
      id: raw.id || `training-${idx + 1}`,
      title: raw.title || 'Untitled Training',
      category: raw.category || 'Specialized Track',
      badge: raw.badge || raw.category || 'Specialized Track',
      date: raw.date || 'Scheduled Batches',
      location: raw.location || 'Philippines',
      organizer: raw.organizer || 'GG Automation Construction Services',
      videoUrl: raw.videoUrl || '',
      image: defaultCover,
      gallery: normalizeTrainingGallery(raw.gallery, defaultCover),
      description: raw.description || '',
      topics: Array.isArray(raw.topics) ? raw.topics.filter(Boolean) : [],
      targetAudience: raw.targetAudience || 'Corporate & Academic Groups',
      registrationUrl: raw.registrationUrl || '/contact',
      tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : ['Training'],
    };
  });
}

export const initialTrainings: TrainingItem[] = parseRawTrainings(rawTrainingsData as TrainingRawInput[]);
