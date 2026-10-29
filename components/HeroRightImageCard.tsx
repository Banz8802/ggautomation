'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  Calendar,
  Play,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface HeroCardSlideData {
  id: number | string;
  title: string;
  image: string;
  images?: string[];
  videoUrl?: string;
  isTraining?: boolean;
  isNews?: boolean;
  isUpcomingEvent?: boolean;
  isPastEvent?: boolean;
  slideDate?: string;
  slideLocation?: string;
  slideHost?: string;
  primaryCtaHref: string;
}

interface HeroRightImageCardProps {
  slide: HeroCardSlideData;
  isActive: boolean;
}

export default function HeroRightImageCard({ slide, isActive }: HeroRightImageCardProps) {
  const images = useMemo(() => {
    if (Array.isArray(slide.images) && slide.images.length > 0) {
      const valid = slide.images.filter(
        (img): img is string => typeof img === 'string' && img.trim().length > 0
      );
      if (valid.length > 0) return valid;
    }
    return slide.image ? [slide.image] : ['/images/hero-solar-engineering.webp'];
  }, [slide.images, slide.image]);

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Reset to first image whenever slide changes
  useEffect(() => {
    setActiveImgIdx(0);
  }, [slide.id]);

  // Smoothly cycle through images inside this box every 3 seconds if multiple images exist
  useEffect(() => {
    if (!isActive || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, images.length, slide.id]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-900/80 shadow-2xl backdrop-blur-xl group/card hover:border-[#ffc000]/50 transition-all duration-500">
      <div className="relative h-80 sm:h-[400px] w-full overflow-hidden bg-slate-950">
        {/* Animated Image Slides */}
        {images.map((imgSrc, idx) => {
          const isSelected = idx === activeImgIdx;
          return (
            <div
              key={`${imgSrc}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isSelected ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={imgSrc}
                alt={`${slide.title} photo ${idx + 1}`}
                fill
                className={`object-cover transition-transform duration-3000 ease-out ${
                  isSelected ? 'scale-105' : 'scale-100'
                }`}
                sizes="(max-width: 1200px) 50vw, 40vw"
                priority={idx === 0}
              />
            </div>
          );
        })}

        {/* Gradient Overlay for high-contrast badge & text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-20 pointer-events-none" />

        {/* Top Floating Badge on Image Card */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
          {slide.isUpcomingEvent ? (
            <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-400 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-500/50 shadow-lg shadow-emerald-950/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upcoming Event</span>
            </span>
          ) : slide.isPastEvent ? (
            <span className="bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-slate-600/60 shadow-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Past Event</span>
            </span>
          ) : (
            <span className="bg-slate-950/85 backdrop-blur-md text-[#ffc000] text-xs font-black px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc000]" />
              <span>
                {slide.isTraining
                  ? 'Featured /trainings'
                  : slide.isNews
                  ? 'Featured /news-updates'
                  : 'GG Automation'}
              </span>
            </span>
          )}

          {slide.slideDate && (
            <span className="bg-cyan-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="truncate max-w-[140px]">{slide.slideDate}</span>
            </span>
          )}
        </div>

        {/* Center Video Play Button if available */}
        {slide.videoUrl ? (
          <a
            href={slide.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Play Video"
            className="absolute inset-0 flex items-center justify-center group/play cursor-pointer z-30"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e51a24] to-[#ffc000] text-white shadow-2xl flex items-center justify-center group-hover/play:scale-110 active:scale-95 transition-all">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
          </a>
        ) : null}

        {/* Manual Left/Right Image Navigation Buttons if multiple images exist */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 z-30 pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 pointer-events-auto opacity-75 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Previous event image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 pointer-events-auto opacity-75 hover:opacity-100 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Next event image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Card Caption Details */}
        <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-2 z-30">
          <div className="text-xs font-black text-white line-clamp-2 leading-snug">
            {slide.title}
          </div>

          {slide.slideLocation && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#e51a24] flex-shrink-0" />
              <span className="truncate">{slide.slideLocation}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-1 border-t border-white/10">
            <span className="truncate max-w-[180px]">
              {slide.slideHost || 'GG Automation Clean Energy'}
            </span>
            <Link
              href={slide.primaryCtaHref}
              className="text-[#ffc000] hover:underline flex items-center gap-1"
            >
              <span>Explore</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
