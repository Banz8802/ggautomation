'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { ArrowRight, Home, Building2, Factory, GraduationCap, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects as initialProjects, parseRawProjects, ProjectItem, ProjectRawInput } from '@/data/projectsData';

interface ServiceTypeConfig {
  id: string;
  category: 'Residential' | 'Commercial' | 'Industrial' | 'School';
  title: string;
  icon: React.ReactNode;
  image: string;
  headline: string;
  description: string;
  link: string;
  badge: string;
}

const serviceTypes: ServiceTypeConfig[] = [
  {
    id: 'residential',
    category: 'Residential',
    title: 'Residential',
    icon: <Home className="w-5 h-5 text-[#0b7337]" />,
    image: '/images/service-residential.webp',
    headline: 'Turn your roof into a source of savings.',
    description:
      'GG Automation delivers smart, efficient solar solutions that cut your electricity bills and power your home with clean energy. We handle everything—from design to installation and net-metering support—so you can enjoy worry-free savings and a greener lifestyle.',
    link: '/projects?category=Residential',
    badge: 'Home Solar',
  },
  {
    id: 'commercial',
    category: 'Commercial',
    title: 'Commercial',
    icon: <Building2 className="w-5 h-5 text-[#e51a24]" />,
    image: '/images/service-commercial.webp',
    headline: 'Power your business, lower your overhead.',
    description:
      'GG Automation provides tailored solar solutions for commercial spaces, helping you cut energy costs, boost efficiency, and showcase your commitment to sustainability. We deliver full-service installations with minimal disruption to your operations.',
    link: '/projects?category=Commercial',
    badge: 'Business Solar',
  },
  {
    id: 'industrial',
    category: 'Industrial',
    title: 'Industrial',
    icon: <Factory className="w-5 h-5 text-[#ffc000]" />,
    image: '/images/service-industrial.webp',
    headline: 'Energy solutions built for heavy demand.',
    description:
      'Our industrial solar systems are engineered for high-performance and long-term reliability. From factories to large facilities, GG Automation ensures robust installations that reduce operating costs and future-proof your energy needs.',
    link: '/projects?category=Industrial',
    badge: 'Heavy Industry',
  },
  {
    id: 'schools',
    category: 'School',
    title: 'School & Universities',
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
    image: '/images/uclm-roof2.webp',
    headline: 'Clean campus energy, lower institutional overhead.',
    description:
      'GG Automation designs turnkey institutional solar installations for campuses, academies, and universities. We help educational institutions cut operating costs, advance sustainability, and provide live energy learning for students.',
    link: '/projects?category=School',
    badge: 'Campus Solar',
  },
];

interface ProjectSlideImage {
  src: string;
  projectTitle?: string;
  capacity?: string;
  location?: string;
}

function ServiceCard({
  item,
  projectImages,
  cardIndex,
}: {
  item: ServiceTypeConfig;
  projectImages: ProjectSlideImage[];
  cardIndex: number;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through project images in this category with staggered starting offsets
  useEffect(() => {
    if (projectImages.length <= 1 || isHovered) return;

    let intervalId: NodeJS.Timeout;
    const initialDelay = (cardIndex * 900) % 3600;

    const timeoutId = setTimeout(() => {
      // Step to next image once
      setCurrentIdx((prev) => (prev + 1) % projectImages.length);

      // Continue regular looping
      intervalId = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % projectImages.length);
      }, 3800);
    }, 2800 + initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [projectImages.length, isHovered, cardIndex]);

  const activeImage = projectImages[currentIdx] || { src: item.image };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % projectImages.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-[#e51a24]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
    >
      <div className="space-y-4">
        {/* Card Top Image Carousel with Rounded Corners */}
        <Link
          href={item.link}
          className="block relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group/img cursor-pointer"
        >
          {/* Active Image with smooth crossfade */}
          <div className="relative w-full h-full">
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.projectTitle || `${item.title} Solar Services`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>

          {/* Top Category Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#091833] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-200 z-10 pointer-events-none">
            {item.badge}
          </div>

          {/* Photo Reel Pill & Counter (Shows when multiple projects exist) */}
          {projectImages.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-sm z-10 pointer-events-none">
              <Camera className="w-2.5 h-2.5 text-[#ffc000]" />
              <span>
                {currentIdx + 1}/{projectImages.length}
              </span>
            </div>
          )}

          {/* Optional Interactive Next/Prev arrows on hover */}
          {projectImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Bottom Title / Capacity Overlay if available */}
          {activeImage.projectTitle && (
            <div className="absolute bottom-2 left-3 right-3 text-white z-10 pointer-events-none">
              <div className="text-[11px] font-bold truncate drop-shadow-md">
                {activeImage.projectTitle}
              </div>
              {activeImage.capacity && (
                <div className="text-[9px] text-[#ffc000] font-semibold truncate drop-shadow-sm">
                  {activeImage.capacity} • {activeImage.location || 'Commissioned Installation'}
                </div>
              )}
            </div>
          )}

          {/* Multi-Image Dots Indicator at bottom */}
          {projectImages.length > 1 && (
            <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1 z-10 pointer-events-none">
              {projectImages.slice(0, 8).map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    dotIdx === currentIdx % 8 ? 'w-3.5 bg-[#ffc000]' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Card Title */}
        <Link href={item.link} className="block">
          <h3 className="text-xl sm:text-2xl font-black text-[#091833] tracking-tight group-hover:text-[#e51a24] transition-colors">
            {item.title}
          </h3>
        </Link>

        {/* Headline & Body Copy */}
        <div className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {item.headline}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-5">
            {item.description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6 mt-4 border-t border-slate-100">
        <Link
          href={item.link}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md hover:shadow-red-600/30 transition-all duration-200 group/btn"
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function SolarServiceTypesSection() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);

  // Fetch live projects from /api/projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          const parsed = parseRawProjects(data.projects as ProjectRawInput[]);
          if (parsed.length > 0) {
            setProjectsList(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load projects for services section:', err);
      }
    }
    loadProjects();
  }, []);

  // Map ONLY the first image per project for each category from live projects
  const getCategoryImages = (category: ServiceTypeConfig['category'], defaultImage: string): ProjectSlideImage[] => {
    const matchingProjects = projectsList.filter((p) => p.category === category);

    const slides: ProjectSlideImage[] = [];

    // Collect only the first (primary) image from each project in this category
    matchingProjects.forEach((proj) => {
      const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
      if (firstImg && !slides.some((s) => s.src === firstImg)) {
        slides.push({
          src: firstImg,
          projectTitle: proj.title,
          capacity: proj.capacity,
          location: proj.location,
        });
      }
    });

    if (slides.length === 0) {
      return [{ src: defaultImage }];
    }

    return slides;
  };

  return (
    <section
      id="services"
      className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200 scroll-mt-16"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="SOLAR SERVICES & SECTORS"
          title="Engineered Solar Solutions for Every Sector"
          subtitle="Whether powering private homes, commercial shopping malls, massive industrial plants, or providing lifetime maintenance, GG Automation delivers certified clean energy excellence."
        />

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {serviceTypes.map((item, idx) => {
            const categoryImages = getCategoryImages(item.category, item.image);
            return (
              <ServiceCard
                key={item.id}
                item={item}
                projectImages={categoryImages}
                cardIndex={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

