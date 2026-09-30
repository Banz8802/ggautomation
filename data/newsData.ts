export interface NewsArticle {
  id: string;
  title: string;
  category: 'Scholarship' | 'Global Tour' | 'Exhibition' | 'Technical Seminar';
  date: string;
  formattedDate: string;
  authorOrHost: string;
  location: string;
  image: string;
  summary: string;
  fullContent: string[];
  highlights: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    facebookUrl?: string;
  };
  tags: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'tesda-scholarship-solar-pv',
    title: 'FREE TESDA SCHOLARSHIP: Learn to Install Solar Energy Systems in Your Home! Build Your Career in Clean Energy!',
    category: 'Scholarship',
    date: '2026-09-04',
    formattedDate: 'September 4, 2026',
    authorOrHost: 'CEAAPI & TESDA Region VII Cebu',
    location: 'TESDA-Cebu Compound, Lahug, Cebu City',
    image: '/images/news/tesda-scholarship.png',
    summary: 'Power up your home, master Solar PV installation, and become a sustainable homeowner! Step into the booming renewable energy sector at ZERO COST with CEAAPI and TESDA Cebu.',
    fullContent: [
      'Power up your home, master Solar PV installation, and become a sustainable homeowner! Step into the booming renewable energy sector—at ZERO COST! 💡',
      'CEAAPI, in partnership with TESDA Cebu, is now accepting applicants for the Solar PV Installation Training Program. Be a part of the program and apply today! 🚀',
      'This comprehensive scholarship equips future installers and technicians with direct practical competencies, safety standards, and hands-on electrical skills required for immediate employment and residential solar self-reliance.',
      'Training Venue: CEAAPI Solar PV Training Center, TESDA-Cebu Compound, Lahug, Cebu City. First batch commences on September 14, 2026. Note that slots are strictly limited per batch and awarded on a first-come, first-served basis!'
    ],
    highlights: [
      'Site Assessment & Design Fundamentals',
      'Component Inspection, PV Hardware & Compliance Checking',
      'Mechanical & Electrical Installation Practices',
      'Systems Testing, Commissioning & Maintenance Protocols',
      'Occupational Health, Safety & Workplace Standards'
    ],
    contactInfo: {
      phone: '0922-8129374',
      email: 'ceaapi2024@gmail.com'
    },
    tags: ['TESDA Scholarship', 'Free Training', 'Solar Installation', 'CEAAPI', 'Renewable Energy', 'Green Jobs', 'Clean Energy Future']
  },
  {
    id: 'huawei-rd-headquarters-dongguan-china',
    title: 'At the R & D Headquarters of Huawei in Dongguan, China — International Technical Delegation',
    category: 'Global Tour',
    date: '2026-08-27',
    formattedDate: 'August 27, 2026',
    authorOrHost: 'Edgar Escalante with GG Automation Team',
    location: 'Huawei Global R&D Headquarters, Dongguan, China',
    image: '/images/news/huawei-rd-dongguan.png',
    summary: 'GG Automation leadership and engineering delegates visited Huawei R&D Headquarters in Dongguan, China to inspect next-generation 150 kW High-Power C&I inverters and 215kWh hybrid liquid-cooling grid-forming energy storage systems.',
    fullContent: [
      'At the R & D Headquarters of Huawei in Dongguan, China with Boss Jay-Ar Reynes, Kuya Gel Sanchez, Ms. Ivy, Val, Anthony and Wife & Ms. Mae Ann... 👏👏👏',
      'Special thanks to Stephen Zhang for inviting our team and Ms. Eunice for accommodating the Cebu delegation throughout the state-of-the-art facility tour.',
      'During the high-level technical briefing, the team reviewed Huawei FusionSolar latest breakthroughs, including the 150 kW Series High-Power Commercial & Industrial Inverters and the 215kWh Series Hybrid Liquid-Cooling Grid-Forming Energy Storage System (ESS).',
      'These advanced systems allow commercial complexes, industrial plants, and utility micro-grids in the Philippines to stabilize intermittent power and achieve autonomous power factor control.'
    ],
    highlights: [
      'Huawei FusionSolar R&D Campus Study Tour',
      '150 kW High-Power C&I Solar Inverter Architecture',
      '215kWh Liquid-Cooling Grid-Forming Battery ESS',
      'Smart Grid SCADA & Cloud Monitoring Integration'
    ],
    tags: ['Huawei FusionSolar', 'R&D Tour', 'Dongguan China', 'Grid-Forming ESS', '150kW Inverter', 'Global Tech']
  },
  {
    id: 'cebucon-build-expo-sm-seaside',
    title: 'CEBUCON BUILD EXPO 2026: Visit Us at SM Seaside City Cebu with Belmont Hardware Depot!',
    category: 'Exhibition',
    date: '2026-05-27',
    formattedDate: 'May 27, 2026 (Expo: June 4-7, 2026)',
    authorOrHost: 'Ramil Asignar & Belmont Hardware Depot',
    location: 'SM Seaside City Cebu (Sky Hall & Convention Center)',
    image: '/images/news/cebucon-expo.png',
    summary: 'Suroy namo ngadto CEBUCON SM SEASIDE! We are heading to CEBUCON Build Expo 2026 featuring top-tier inverter brands, solar mounting systems, and live engineering consultations.',
    fullContent: [
      'Suroy namo ngadto CEBUCON SM SEASIDE! 🛠️📦',
      'Belmont Hardware Depot and GG Automation are heading to the premier CEBUCON Build Expo 2026 from June 4 to 7, 2026 at SM Seaside City Cebu.',
      'Skip the store run and come visit our booth to explore top-rated solar hardware, smart inverters, and heavy electrical equipment from global brands including Huawei, Deye, LVFU, Ridgid, Makita, Thomas Electric, Kiel, Bullstrong, Uni-T, and Power Craft.',
      'Our licensed solar engineers will be on-site to provide live rooftop solar consultations, Net-Metering payback calculations, and exclusive expo contractor discounts.'
    ],
    highlights: [
      'CEBUCON Build Expo Premier Exhibition',
      'Featuring Huawei, Deye, LVFU, Makita & Ridgid',
      'Live Engineering Consultations & ROI Estimations',
      'Exclusive Contractor Packages & Hardware Discounts'
    ],
    tags: ['CEBUCON Expo', 'SM Seaside Cebu', 'Belmont Hardware Depot', 'Trade Show', 'Solar Hardware']
  },
  {
    id: 'floating-solar-seminar-cavinti-laguna',
    title: 'Floating Solar PV Installation Techniques & Material Optimization — Seminar & Live Demo',
    category: 'Technical Seminar',
    date: '2025-08-15',
    formattedDate: 'August 15, 2025',
    authorOrHost: 'Power Ai Philippines & Power Philippines',
    location: 'Chandava Lake Resort, Cavinti, Laguna',
    image: '/images/hero-floating-solar.jpg',
    summary: 'A glimpse into our Floating Solar PV Seminar & Live Demo held at Chandava Lake Resort, Cavinti, Laguna! An inspiring day filled with learning, hands-on activities, and on-water array assembly.',
    fullContent: [
      'A glimpse into our Floating Solar PV Seminar & Live Demo held last August 15, 2025 at Chandava Lake Resort, Cavinti, Laguna! 🌊☀️',
      'It was an inspiring day filled with learning, hands-on activities, and the exciting showcase of floating solar installation directly on the water surface.',
      'Delegates and municipal engineers explored UV-stabilized pontoon buoyancy, anchor tension physics, marine cabling safety, and evaporation suppression benefits.',
      'Huge thanks to our speakers, participants, and Power Philippines for being part of this successful clean energy milestone!'
    ],
    highlights: [
      'Water-Surface Anchoring & Pontoon Mechanics',
      'Enhanced Photovoltaic Yield via Natural Water Cooling',
      'Marine-Grade Anti-Corrosive Hardware Selection',
      'Submersible DC Cabling & Inverter Grounding'
    ],
    contactInfo: {
      facebookUrl: 'https://www.facebook.com/watch/?v=764063712674607'
    },
    tags: ['Floating Solar', 'Power Ai Philippines', 'Laguna', 'Live Demo', 'Cavinti', 'Clean Tech']
  }
];
