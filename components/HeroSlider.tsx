'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Sun, ShieldCheck, Zap, Pause, Play } from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  image: string;
  stats: { label: string; value: string }[];
}

const slides: Slide[] = [
  {
    id: 1,
    badge: 'EPC & RENEWABLE ENERGY SPECIALIST',
    badgeIcon: <Sun className="w-4 h-4 text-[#ffc000]" />,
    title: 'Engineering High-Yield',
    highlightText: 'Renewable Energy & Power Systems',
    subtitle: 'Handling small to medium scale installation, maintenance, and turnkey electrical engineering services across commercial, industrial, and institutional sites.',
    primaryCtaText: 'Explore Services',
    primaryCtaHref: '#services',
    secondaryCtaText: 'Get Free Quote',
    secondaryCtaHref: '#calculator',
    image: '/images/hero-solar-engineering.jpg',
    stats: [
      { label: 'Installed Capacity', value: '15+ MWp' },
      { label: 'Utility Bill Savings', value: 'Up to 70%' },
      { label: 'System Reliability', value: '99.8%' },
    ],
  },
  {
    id: 2,
    badge: 'SMART SOLAR INSTALLATIONS',
    badgeIcon: <Zap className="w-4 h-4 text-[#ffc000]" />,
    title: 'Advanced On-Grid, Hybrid &',
    highlightText: 'Off-Grid Solar Power Systems',
    subtitle: 'Engineered for maximum efficiency, zero-outage battery storage backup, and long-term net-metering energy cost reduction.',
    primaryCtaText: 'View Solar Systems',
    primaryCtaHref: '#solar-systems',
    secondaryCtaText: 'Consult Our Engineers',
    secondaryCtaHref: '#contact',
    image: '/images/hero-commercial-systems.jpg',
    stats: [
      { label: 'Tier-1 Hardware', value: '25-Yr Warranty' },
      { label: 'Monitoring', value: '24/7 Smart Cloud' },
      { label: 'ROI Timeline', value: '3 - 5 Years' },
    ],
  },
  {
    id: 3,
    badge: 'INNOVATION IN CLEAN TECH',
    badgeIcon: <ShieldCheck className="w-4 h-4 text-[#ffc000]" />,
    title: 'Pioneering Floating Solar PV &',
    highlightText: 'Turnkey Commercial Micro-Grids',
    subtitle: 'Leading sustainable engineering with water-reservoir floating solar arrays, micro-grids, and structured project financing up to 500MW capacity.',
    primaryCtaText: 'Our Installation Process',
    primaryCtaHref: '#process',
    secondaryCtaText: 'View Projects',
    secondaryCtaHref: '#projects',
    image: '/images/hero-floating-solar.jpg',
    stats: [
      { label: 'Floating Solar', value: 'Cavinti Laguna' },
      { label: 'Funding Capacity', value: '100kW - 500MW' },
      { label: 'Commercial Clients', value: '50+ Major Sites' },
    ],
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 6000; // 6 seconds

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, slideDuration);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section 
      id="hero" 
      className="relative bg-[#091833] text-white min-h-[620px] md:min-h-[700px] lg:min-h-[760px] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Carousel"
    >
      {/* Background Images with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-10000 linear"
            sizes="100vw"
          />
          {/* Gradients Overlay for crisp high-contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#091833] via-[#091833]/85 to-[#091833]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-[#091833]/60" />
          {/* Subtle Grid overlay line pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="max-w-3xl">
          {/* Animated Slide Content */}
          {slides.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <div key={slide.id} className="animate-fade-in space-y-6">
                {/* Red Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e51a24]/20 border border-[#e51a24]/50 backdrop-blur-md">
                  {slide.badgeIcon}
                  <span className="text-xs md:text-sm font-bold tracking-widest text-[#ffc000] uppercase">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
                  {slide.title}{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffc000] via-amber-300 to-[#e51a24]">
                    {slide.highlightText}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={slide.primaryCtaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg hover:shadow-red-600/30 transition-all duration-200 group"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href={slide.secondaryCtaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all duration-200"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </a>
                </div>

                {/* Key Metrics Bar */}
                <div className="pt-6 grid grid-cols-3 gap-3 md:gap-6 border-t border-white/15 max-w-xl">
                  {slide.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="text-lg sm:text-2xl font-black text-[#ffc000]">{stat.value}</div>
                      <div className="text-xs text-slate-300 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <div className="absolute z-30 bottom-8 right-8 hidden md:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffc000]"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-200"
          aria-label={isPaused ? "Play Autoplay" : "Pause Autoplay"}
          title={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
        >
          {isPaused ? <Play className="w-4 h-4 text-[#ffc000]" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffc000]"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators & Timer Progress Bar */}
      <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-10 bg-[#e51a24]' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium text-slate-300 tracking-wider">
          0{currentSlide + 1} / 0{slides.length}
        </span>
      </div>
    </section>
  );
}
