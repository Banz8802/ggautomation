import rawCategoriesData from './homeCategories.json';

export interface ProjectPhotoSelection {
  projectId: string;
  projectTitle: string;
  photoCount: number;
  selectedImages?: string[];
  enabled: boolean;
}

export interface HomeCategoryItem {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial' | 'School';
  title: string;
  badge: string;
  headline: string;
  description: string;
  link: string;
  mode: 'auto' | 'custom' | 'projects';
  projectSelections?: ProjectPhotoSelection[];
  customImages: string[];
  defaultImage: string;
  enabled?: boolean;
  order?: number;
}

export const initialHomeCategories: HomeCategoryItem[] = [
  {
    id: 'residential',
    category: 'Residential',
    title: 'Residential',
    badge: 'Home Solar',
    headline: 'Turn your roof into a source of savings.',
    description:
      'GG Automation delivers smart, efficient solar solutions that cut your electricity bills and power your home with clean energy. We handle everything—from design to installation and net-metering support—so you can enjoy worry-free savings and a greener lifestyle.',
    link: '/projects?category=Residential',
    mode: 'auto',
    projectSelections: [],
    customImages: ['/images/service-residential.webp'],
    defaultImage: '/images/service-residential.webp',
    enabled: true,
    order: 1,
  },
  {
    id: 'commercial',
    category: 'Commercial',
    title: 'Commercial',
    badge: 'Business Solar',
    headline: 'Power your business, lower your overhead.',
    description:
      'GG Automation provides tailored solar solutions for commercial spaces, helping you cut energy costs, boost efficiency, and showcase your commitment to sustainability. We deliver full-service installations with minimal disruption to your operations.',
    link: '/projects?category=Commercial',
    mode: 'auto',
    projectSelections: [],
    customImages: ['/images/service-commercial.webp'],
    defaultImage: '/images/service-commercial.webp',
    enabled: true,
    order: 2,
  },
  {
    id: 'industrial',
    category: 'Industrial',
    title: 'Industrial',
    badge: 'Heavy Industry',
    headline: 'Energy solutions built for heavy demand.',
    description:
      'Our industrial solar systems are engineered for high-performance and long-term reliability. From factories to large facilities, GG Automation ensures robust installations that reduce operating costs and future-proof your energy needs.',
    link: '/projects?category=Industrial',
    mode: 'auto',
    projectSelections: [],
    customImages: ['/images/service-industrial.webp'],
    defaultImage: '/images/service-industrial.webp',
    enabled: true,
    order: 3,
  },
  {
    id: 'schools',
    category: 'School',
    title: 'School & Universities',
    badge: 'Campus Solar',
    headline: 'Clean campus energy, lower institutional overhead.',
    description:
      'GG Automation designs turnkey institutional solar installations for campuses, academies, and universities. We help educational institutions cut operating costs, advance sustainability, and provide live energy learning for students.',
    link: '/projects?category=School',
    mode: 'projects',
    projectSelections: [
      {
        projectId: 'uclm-campus-ongoing',
        projectTitle: 'UCLM University of Cebu Lapu-Lapu & Mandaue Campus',
        photoCount: 1,
        selectedImages: ['/images/uclm-roof2.webp'],
        enabled: true,
      },
      {
        projectId: 'project-1791307990397',
        projectTitle: 'ATENEO de CEBU, (Sacred Heart School)',
        photoCount: 2,
        selectedImages: [
          '/images/projects/uploads/1791308986788_e8daf55a-3eee-440e-86d7-32be0cea6e53.jpg',
          '/images/projects/uploads/1791308990520_aa791c43-1fc4-470a-8329-7739d305ca44.jpg',
        ],
        enabled: true,
      },
    ],
    customImages: [
      '/images/uclm-roof2.webp',
      '/images/projects/uploads/1791308986788_e8daf55a-3eee-440e-86d7-32be0cea6e53.jpg',
      '/images/projects/uploads/1791308990520_aa791c43-1fc4-470a-8329-7739d305ca44.jpg',
    ],
    defaultImage: '/images/uclm-roof2.webp',
    enabled: true,
    order: 4,
  },
];

export function getHomeCategories(): HomeCategoryItem[] {
  if (Array.isArray(rawCategoriesData) && rawCategoriesData.length > 0) {
    return rawCategoriesData as HomeCategoryItem[];
  }
  return initialHomeCategories;
}
