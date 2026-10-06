'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { ArrowRight, Home, Building2, Factory, GraduationCap, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects as initialProjects, parseRawProjects, ProjectItem, ProjectRawInput, isVideoUrl } from '@/data/projectsData';
import { initialHomeCategories, HomeCategoryItem } from '@/data/homeCategoriesData';

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
  item: HomeCategoryItem;
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

  const activeImage = projectImages[currentIdx] || { src: item.defaultImage || '/images/placeholder.webp' };

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
          href={item.link || '/projects'}
          className="block relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group/img cursor-pointer"
        >
          {/* Sliding Track for Images & Videos */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIdx * 100}%)` }}
          >
            {projectImages.map((slide, sIdx) => (
              <div key={sIdx} className="relative w-full h-full flex-shrink-0">
                {isVideoUrl(slide.src) ? (
                  <video
                    src={slide.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                  />
                ) : (
                  <Image
                    src={slide.src}
                    alt={slide.projectTitle || `${item.title} Solar Services`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={cardIndex < 4 && sIdx === 0}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none"></div>

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
        <Link href={item.link || '/projects'} className="block">
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
          href={item.link || '/projects'}
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
  const [categoriesList, setCategoriesList] = useState<HomeCategoryItem[]>(initialHomeCategories);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);

  // Fetch live home-categories and projects from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, projRes] = await Promise.all([
          fetch('/api/home-categories'),
          fetch('/api/projects')
        ]);

        const catData = await catRes.json();
        if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
          setCategoriesList(catData.categories);
        }

        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.projects)) {
          const parsed = parseRawProjects(projData.projects as ProjectRawInput[]);
          if (parsed.length > 0) {
            setProjectsList(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load home categories data:', err);
      }
    }
    loadData();
  }, []);

  // Map images for a category based on its configured mode (Projects vs Auto vs Custom)
  const getCategoryImages = (cat: HomeCategoryItem): ProjectSlideImage[] => {
    // 1. Projects selection mode (or when projectSelections are explicitly configured)
    if (
      cat.mode === 'projects' ||
      (cat.projectSelections && cat.projectSelections.length > 0 && cat.mode !== 'auto' && cat.mode !== 'custom')
    ) {
      const slides: ProjectSlideImage[] = [];
      const enabledSelections = (cat.projectSelections || []).filter((s) => s.enabled !== false);

      enabledSelections.forEach((sel) => {
        // Find matching project by ID or Title
        const proj = projectsList.find(
          (p) => p.id === sel.projectId || p.title.toLowerCase() === sel.projectTitle.toLowerCase()
        );

        if (proj && proj.images && proj.images.length > 0) {
          // If specific images are chosen, use them; otherwise take first `photoCount` images
          let chosenImgs: string[] = [];
          if (sel.selectedImages && sel.selectedImages.length > 0) {
            chosenImgs = sel.selectedImages;
          } else {
            const count = Math.max(1, sel.photoCount || 1);
            chosenImgs = proj.images.slice(0, count);
          }

          chosenImgs.forEach((src) => {
            if (src && !slides.some((s) => s.src === src)) {
              slides.push({
                src,
                projectTitle: proj.title,
                capacity: proj.capacity,
                location: proj.location,
              });
            }
          });
        }
      });

      if (slides.length > 0) return slides;
    }

    // 2. Custom Uploaded Reel mode with customImages array
    if (cat.mode === 'custom' && cat.customImages && cat.customImages.length > 0) {
      return cat.customImages.map((src) => ({
        src,
        projectTitle: `${cat.title} Solar Installation`,
        location: 'Philippines',
      }));
    }

    // 3. Auto mode: Collect only the first (primary) image from each project in this category
    const matchingProjects = projectsList.filter((p) => p.category === cat.category);
    const slides: ProjectSlideImage[] = [];

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

    if (slides.length > 0) {
      return slides;
    }

    // 4. Fallback to custom images or default image
    if (cat.customImages && cat.customImages.length > 0) {
      return cat.customImages.map((src) => ({ src, projectTitle: cat.title }));
    }

    return [{ src: cat.defaultImage || '/images/placeholder.webp', projectTitle: cat.title }];
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
          {categoriesList
            .filter((cat) => cat.enabled !== false)
            .map((item, idx) => {
              const categoryImages = getCategoryImages(item);
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


