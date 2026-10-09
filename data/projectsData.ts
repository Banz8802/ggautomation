import rawProjectsData from './projects.json';

export type ProjectCategory = 'All' | 'Residential' | 'Commercial' | 'School' | 'Industrial' | 'Hospitals' | 'Davao Satellite Projects';

export interface ProjectRawInput {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'School' | 'Industrial' | 'Hospitals' | 'Davao Satellite Projects';
  satelliteCategory?: string;
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
  category: 'Residential' | 'Commercial' | 'School' | 'Industrial' | 'Hospitals' | 'Davao Satellite Projects';
  satelliteCategory?: string;
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

export function isDavaoProject(project: {
  satelliteCategory?: string;
  category?: string;
  tags?: string[];
  location?: string;
  title?: string;
}): boolean {
  if (project.satelliteCategory === 'Davao Satellite Projects') return true;
  if (project.category === 'Davao Satellite Projects') return true;
  if (project.tags?.some((t) => t.toLowerCase().includes('davao satellite'))) return true;
  return false;
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
 * Intelligent AI-like helper to analyze a project title and generate
 * specific, high-quality descriptions, engineering checklists, capacities, and tags.
 */
export interface GeneratedProjectDetails {
  capacity?: string;
  client?: string;
  systemType?: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export function generateProjectDetailsFromTitle(
  title: string,
  category: ProjectCategory = 'Residential',
  existingLocation?: string,
  existingClient?: string
): GeneratedProjectDetails {
  const cleanTitle = (title || '').trim();
  const lower = cleanTitle.toLowerCase();
  const cat = category === 'All' ? 'Residential' : category;

  // 1. Extract Client / Organization Name if in title (e.g. before comma or hyphen)
  let extractedClient = existingClient && existingClient !== 'Valued Client' ? existingClient : '';
  if (!extractedClient && cleanTitle) {
    const parts = cleanTitle.split(/[,-–—]/);
    if (parts.length > 1 && parts[0].trim().length > 2) {
      const candidate = parts[0].trim().replace(/[“"”]/g, '"');
      // If it looks like a person's or company's name
      if (!/^\d+(\.\d+)?\s*(kw|kwp|mw)/i.test(candidate)) {
        extractedClient = candidate;
      }
    }
  }
  if (!extractedClient) {
    extractedClient = cleanTitle.split(',')[0].trim() || `${cat} Project`;
  }

  // 2. Detect System Characteristics from Title
  const isHybrid = /hybrid/i.test(lower);
  const hasBattery = /battery|lifepo4|lithium|\d+ah/i.test(lower);
  const batteryMatch = cleanTitle.match(/(\d+\s*AH|\d+\s*Ah|\d+\s*ah)\s*(?:Lithium\s*)?(?:LIFEPO4|LiFePO4|LFP|Lithium)?(?:\s*Battery)?/i);
  const batterySpecs = batteryMatch ? batteryMatch[0].trim() : (hasBattery ? 'Lithium LiFePO4 Battery Storage' : '');

  const isOnGrid = /on-grid|ongrid|grid-tied|grid tied/i.test(lower) || (!isHybrid && !/off-grid/i.test(lower));
  const isOffGrid = /off-grid|offgrid|standalone/i.test(lower);

  const isMultiRoof = /roof side|roof-side|per roof|4-roof|multi-roof/i.test(lower);
  const multiRoofMatch = cleanTitle.match(/(\d+\s*kWp\s*per\s*roof\s*side|\d+\s*kW\s*per\s*roof)/i);
  const multiRoofDetails = multiRoofMatch ? multiRoofMatch[0] : (isMultiRoof ? 'multi-sided roof array' : '');

  const isDualSystem = /plus|\+|&|\bdual\b/i.test(lower) && /\d+\s*kwp/i.test(lower);
  const capacityMatch = cleanTitle.match(/(\d+(?:\.\d+)?\s*(?:kWp|kW|MW|kwp|kw|mw)(?:\s*(?:plus|\+|&)\s*\d+(?:\.\d+)?\s*(?:kWp|kW|MW|kwp|kw|mw))?)/i);
  const extractedCapacity = capacityMatch ? capacityMatch[0] : '';

  // 3. Formulate System Type
  let systemType = '';
  if (isHybrid && hasBattery) {
    systemType = `Hybrid Solar PV with ${batterySpecs || 'Lithium LiFePO4'} Storage`;
  } else if (isHybrid) {
    systemType = 'Hybrid Solar PV & Energy Storage Ready';
  } else if (isMultiRoof) {
    systemType = 'Multi-Roof Distributed On-Grid Solar PV';
  } else if (isDualSystem) {
    systemType = 'Synchronized Multi-Inverter On-Grid PV';
  } else if (isOnGrid) {
    systemType = `${cat} On-Grid Solar PV System`;
  } else if (isOffGrid) {
    systemType = 'Off-Grid Independent Solar PV System';
  } else {
    systemType = `${cat} Solar PV System`;
  }

  // 4. Generate Professional Tailored Description
  let description = '';
  const locText = existingLocation ? ` in ${existingLocation}` : '';

  if (isHybrid && hasBattery) {
    description = `High-efficiency ${extractedCapacity ? `${extractedCapacity} ` : ''}Hybrid solar power installation integrated with ${batterySpecs || 'a Lithium LiFePO4 battery energy storage system'}, engineered for seamless emergency backup power, peak shaving, and maximum energy independence${locText}.`;
  } else if (isMultiRoof) {
    description = `Custom-engineered ${extractedCapacity ? `${extractedCapacity} ` : ''}On-Grid solar rooftop installation featuring an optimized distributed roof layout (${multiRoofDetails || 'multi-roof string configuration'}) to capture maximum solar irradiance from morning to late afternoon${locText}.`;
  } else if (isDualSystem) {
    description = `High-performance ${extractedCapacity ? `${extractedCapacity} ` : ''}solar installation featuring a synchronized multi-inverter architecture for balanced phase grid injection, maximized self-consumption, and drastic utility bill savings${locText}.`;
  } else if (cat === 'Commercial' || /factory|mall|super metro|commercial|store|plant|warehouse/i.test(lower)) {
    description = `Commercial-grade ${extractedCapacity ? `${extractedCapacity} ` : ''}turnkey solar rooftop system engineered for high daytime load offset, operational expense reduction, and intelligent real-time energy analytics${locText}.`;
  } else if (cat === 'School' || /school|university|campus|college|academy/i.test(lower)) {
    description = `Institutional ${extractedCapacity ? `${extractedCapacity} ` : ''}campus solar installation providing sustainable clean energy generation, drastically reducing daytime operating overhead while showcasing eco-friendly educational infrastructure${locText}.`;
  } else if (cat === 'Industrial') {
    description = `Heavy-duty industrial ${extractedCapacity ? `${extractedCapacity} ` : ''}solar power plant engineered for high continuous manufacturing load offset, utility net-metering synchronization, and long-term operating resilience${locText}.`;
  } else if (cat === 'Hospitals' || /hospital|medical|clinic|healthcare/i.test(lower)) {
    description = `Healthcare-grade ${extractedCapacity ? `${extractedCapacity} ` : ''}turnkey solar PV and backup system engineered for critical 24/7 hospital power stability, operational cost reduction, and clean medical facility energy resilience${locText}.`;
  } else {
    description = `Premium residential ${extractedCapacity ? `${extractedCapacity} ` : ''}rooftop solar PV system designed for high daily clean energy harvest, seamless net-metering utility synchronization, and long-term durability${locText}.`;
  }

  // 5. Generate Dynamic Highlights / Checklists (3 to 4 points)
  const highlights: string[] = [];

  if (isHybrid && hasBattery) {
    highlights.push(batterySpecs ? `${batterySpecs} Energy Storage System (ESS)` : 'Lithium LiFePO4 Battery Energy Storage');
    highlights.push('Smart Hybrid Inverter with Instant Auto-Backup Switch');
    highlights.push('Tier-1 High-Yield Monocrystalline PV Modules');
    highlights.push('Real-Time Cloud Telemetry & Battery Health Dashboard');
  } else if (isMultiRoof) {
    highlights.push(`Multi-Roof Array Layout (${multiRoofDetails || 'Optimized Multi-Angle'})`);
    highlights.push('Independent Multi-MPPT Inverter Solar String Tracking');
    highlights.push('Zero-Export Smart Limiter & Utility Net-Metering Ready');
    highlights.push('Corrosion-Resistant Heavy-Duty Aluminum Racking');
  } else if (isDualSystem) {
    highlights.push('Synchronized Multi-Inverter Power Architecture');
    highlights.push('Balanced Multi-Phase Power Grid Injection');
    highlights.push('Tier-1 High-Yield Monocrystalline Solar Array');
    highlights.push('24/7 Mobile Cloud Monitoring & Telemetry');
  } else if (cat === 'Commercial' || /commercial|mall|factory|warehouse/i.test(lower)) {
    highlights.push('Commercial High-Yield Monocrystalline PV Array');
    highlights.push('Industrial-Grade Multi-MPPT String Inverters');
    highlights.push('Peak Daytime Load Shaving & Net-Metering Synchronized');
    highlights.push('Cloud SCADA Telemetry & Performance Analytics');
  } else if (cat === 'School' || /school|university|campus/i.test(lower)) {
    highlights.push('Campus-Wide Green Energy Generation System');
    highlights.push('Tier-1 High-Efficiency Anti-Reflective PV Modules');
    highlights.push('Smart Educational Solar SCADA Telemetry Dashboard');
    highlights.push('Certified Rapid Shutdown & Institutional Safety Protection');
  } else if (cat === 'Industrial') {
    highlights.push('High-Capacity Industrial Rooftop PV Generator');
    highlights.push('Heavy-Duty Inverter Station with Surge & Arc Protection');
    highlights.push('Continuous Factory Daytime Power Demand Offset');
    highlights.push('Real-Time Industrial SCADA Energy Analytics');
  } else if (cat === 'Hospitals' || /hospital|medical|clinic|healthcare/i.test(lower)) {
    highlights.push('Hospital-Grade High-Reliability Solar PV Array');
    highlights.push('Critical Medical Load Protection & Clean Power Quality');
    highlights.push('Dual Grid & Emergency Genset Seamless Synchronization');
    highlights.push('24/7 Redundant Telemetry & Smart Power Monitoring');
  } else {
    highlights.push('Tier-1 High-Yield Monocrystalline Solar Modules');
    highlights.push('High-Efficiency Smart Grid-Tied Inverter System');
    highlights.push('Utility Net-Metering Bi-Directional Synchronized');
    highlights.push('24/7 Mobile App Cloud Monitoring & Reporting');
  }

  // 6. Generate Search Tags
  const tags: string[] = [cat];
  if (isHybrid) tags.push('Hybrid Solar');
  if (hasBattery) tags.push('LiFePO4 Battery');
  if (isOnGrid && !isHybrid) tags.push('On-Grid');
  if (isMultiRoof) tags.push('Multi-Roof Array');
  tags.push('Solar PV');

  return {
    capacity: extractedCapacity,
    client: extractedClient,
    systemType,
    description,
    highlights,
    tags: Array.from(new Set(tags)),
  };
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
 * Parses a raw list of projects with full defaults, resolved image arrays,
 * and automatic intelligent enhancement for descriptions and checklists.
 */
export function parseRawProjects(rawList: ProjectRawInput[]): ProjectItem[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((raw) => {
    const resolvedImages = normalizeProjectImages(raw.images, raw.folder);

    // Check if description or highlights are missing or generic defaults
    const isGenericDesc =
      !raw.description ||
      raw.description.trim() === '' ||
      raw.description.includes('installation engineered for optimal efficiency and reliability') ||
      raw.description.includes('Comprehensive engineering overview');

    const isGenericHighlights =
      !raw.highlights ||
      raw.highlights.length === 0 ||
      (raw.highlights.length === 2 &&
        raw.highlights[0] === 'Tier-1 High-Yield Monocrystalline Modules' &&
        raw.highlights[1] === 'Real-Time SCADA Cloud Telemetry Dashboard') ||
      (raw.highlights.length === 4 && raw.highlights[0] === 'Tier-1 Solar Photovoltaic Modules');

    const autoGenerated =
      isGenericDesc || isGenericHighlights
        ? generateProjectDetailsFromTitle(raw.title, raw.category, raw.location, raw.client)
        : null;

    const finalDescription =
      !isGenericDesc && raw.description
        ? raw.description
        : autoGenerated?.description ||
          `Premium ${raw.category?.toLowerCase() || 'solar'} installation engineered for optimal efficiency and reliability.`;

    const finalHighlights =
      !isGenericHighlights && raw.highlights && raw.highlights.length > 0
        ? raw.highlights
        : autoGenerated?.highlights || [
            'Tier-1 Solar Photovoltaic Modules',
            'Smart Cloud Telemetry & Monitoring',
            'Utility Net-Metering Synchronized',
            'Engineered Structural Racking',
          ];

    const finalCapacity = raw.capacity && raw.capacity !== 'Custom kWp'
      ? raw.capacity
      : autoGenerated?.capacity || 'Custom kWp';

    const finalSystemType = raw.systemType && raw.systemType.trim().length > 0
      ? raw.systemType
      : autoGenerated?.systemType || `${raw.category} Solar PV System`;

    const finalClient = raw.client && raw.client !== 'Valued Client'
      ? raw.client
      : autoGenerated?.client || 'Valued Client';

    return {
      id: raw.id,
      title: raw.title,
      category: raw.category,
      satelliteCategory:
        raw.satelliteCategory ||
        (raw.tags?.some((t) => t.toLowerCase().includes('davao satellite')) ? 'Davao Satellite Projects' : 'None'),
      location: raw.location || 'Philippines',
      capacity: finalCapacity,
      client: finalClient,
      folder: raw.folder,
      images: resolvedImages.length > 0 ? resolvedImages : ['/images/placeholder.webp'],
      systemType: finalSystemType,
      completionDate: raw.completionDate || 'Completed & Fully Commissioned',
      annualYield: raw.annualYield || 'High-Yield Clean Generation',
      co2Offset: raw.co2Offset || 'Significant Carbon Offset',
      description: finalDescription,
      highlights: finalHighlights,
      tags: raw.tags && raw.tags.length > 0 ? raw.tags : autoGenerated?.tags || [raw.category || 'Solar', 'Solar PV'],
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


