export interface FacebookPost {
  id: string | number;
  title: string;
  date: string;
  tag: string;
  location?: string;
  image: string;
  excerpt: string;
  likes?: number;
  comments?: number;
  postUrl: string;
}

export const facebookPosts: FacebookPost[] = [
  {
    id: 1,
    title: 'Floating Solar PV Seminar & Live Demo in Cavinti, Laguna',
    date: 'Recent Update',
    tag: 'Technical Seminar',
    location: 'Cavinti, Laguna',
    image: '/images/hero-floating-solar.jpg',
    excerpt: 'GG Automation successfully hosted an on-site technical demonstration showcasing specialized floating PV racking, mooring anchors, and environmental benefits on reservoir waters.',
    likes: 148,
    comments: 29,
    postUrl: 'https://www.facebook.com/GGAutomation.1',
  },
  {
    id: 2,
    title: 'Commercial & Industrial Rooftop Solar Grid-Tie Project Turnover',
    date: 'Featured Project',
    tag: 'Commercial Solar',
    location: 'Cebu City, Visayas',
    image: '/images/hero-commercial-systems.jpg',
    excerpt: 'Turnkey high-yield solar PV rooftop installation completed for manufacturing facility, cutting daytime operating energy costs by over 65%.',
    likes: 215,
    comments: 42,
    postUrl: 'https://www.facebook.com/GGAutomation.1',
  },
  {
    id: 3,
    title: 'Solar PV Engineering & Preventive Maintenance (O&M) Operations',
    date: 'Engineering Highlight',
    tag: 'Preventive Maintenance',
    location: 'Tagbilaran, Bohol',
    image: '/images/hero-solar-engineering.jpg',
    excerpt: 'Routine thermal drone scanning, I-V curve testing, and string inverter diagnostics ensuring maximum peak generation efficiency for our commercial clients.',
    likes: 184,
    comments: 35,
    postUrl: 'https://www.facebook.com/GGAutomation.1',
  },
];
