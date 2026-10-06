import rawProjectsData from './projects.json';

export type ProjectCategory = 'All' | 'Residential' | 'Commercial' | 'School' | 'Industrial';

export interface ProjectRawInput {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'School' | 'Industrial';
  location?: string;
  capacity?: string;
  client?: string;
  folder?: string;
  images: string | string[]; // Can be comma-separated string OR string array
  systemType?: string;
  completionDate?: string;
  annualYield?: string;
  co2Offset?: string;
  description?: string;
  highlights?: string[];
  tags?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'School' | 'Industrial';
  location: string;
  capacity: string;
  client: string;
  folder?: string;
  images: string[];
  systemType: string;
  completionDate: string;
  annualYield: string;
  co2Offset: string;
  description: string;
  highlights: string[];
  tags: string[];
}

/**
 * Helper to check if a media URL or file path is a video file
 */
export function isVideoUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().split('?')[0];
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogg') ||
    clean.startsWith('data:video/')
  );
}

/**
 * Normalizes project image paths:
 * 1. If images is a comma-separated string, it splits and trims each filename.
 * 2. If folder is provided and image doesn't start with / or http, it prepends the folder.
 */
export function normalizeProjectImages(imagesInput: string | string[], folder?: string): string[] {
  let list: string[] = [];

  if (typeof imagesInput === 'string') {
    list = imagesInput
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
  } else if (Array.isArray(imagesInput)) {
    list = imagesInput.map((img) => img.trim()).filter((img) => img.length > 0);
  }

  const cleanFolder = folder ? folder.trim().replace(/\/+$/, '') : '';

  return list.map((img) => {
    // If it's already an absolute or web URL, leave it
    if (img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    // If folder is provided, prepend it
    if (cleanFolder) {
      return `${cleanFolder}/${img}`;
    }
    // Default fallback to /images/projects/
    return `/images/projects/${img}`;
  });
}

/**
 * Parses a raw list of projects with full defaults and resolved image arrays
 */
export function parseRawProjects(rawList: ProjectRawInput[]): ProjectItem[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((raw) => {
    const resolvedImages = normalizeProjectImages(raw.images, raw.folder);

    return {
      id: raw.id,
      title: raw.title,
      category: raw.category,
      location: raw.location || 'Philippines',
      capacity: raw.capacity || 'Custom kWp',
      client: raw.client || 'Valued Client',
      folder: raw.folder,
      images: resolvedImages.length > 0 ? resolvedImages : ['/images/placeholder.webp'],
      systemType: raw.systemType || `${raw.category} Solar PV System`,
      completionDate: raw.completionDate || 'Completed & Fully Commissioned',
      annualYield: raw.annualYield || 'High-Yield Clean Generation',
      co2Offset: raw.co2Offset || 'Significant Carbon Offset',
      description: raw.description || `Premium ${raw.category?.toLowerCase() || 'solar'} installation engineered for optimal efficiency and reliability.`,
      highlights: raw.highlights && raw.highlights.length > 0 ? raw.highlights : [
        'Tier-1 Solar Photovoltaic Modules',
        'Smart Cloud Telemetry & Monitoring',
        'Utility Net-Metering Synchronized',
        'Engineered Structural Racking'
      ],
      tags: raw.tags && raw.tags.length > 0 ? raw.tags : [raw.category || 'Solar', 'Solar PV', 'Clean Energy']
    };
  });
}

/**
 * Parses and returns all static projects from projects.json
 */
export function getProjects(): ProjectItem[] {
  return parseRawProjects(rawProjectsData as unknown as ProjectRawInput[]);
}

export const projects: ProjectItem[] = getProjects();

