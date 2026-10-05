'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sun,
  ShieldCheck,
  Zap,
  Pause,
  Play,
  GraduationCap,
  Newspaper,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { initialTrainings, parseRawTrainings, TrainingItem, TrainingRawInput } from '@/data/trainingsData';
import { newsArticles as fallbackNews, NewsArticle } from '@/data/newsData';

interface Slide {
  id: number | string;
  badge: string;
  badgeIcon: React.ReactNode;
  badgeType?: 'training' | 'news' | 'standard';
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  image: string;
  videoUrl?: string;
  isTraining?: boolean;
  isNews?: boolean;
  slideDate?: string;
  slideLocation?: string;
  slideHost?: string;
  stats: { label: string; value: string }[];
}

const defaultBaseSlides: Slide[] = [
  {
    id: 'epc-specialist',
    badge: 'EPC & RENEWABLE ENERGY SPECIALIST',
    badgeIcon: <Sun className="w-4 h-4 text-[#ffc000]" />,
    badgeType: 'standard',
    title: 'Engineering High-Yield',
    highlightText: 'Renewable Energy & Power Systems',
    subtitle:
      'Handling small to medium scale installation, maintenance, and turnkey electrical engineering services across commercial, industrial, and institutional sites.',
    primaryCtaText: 'Explore Services',
    primaryCtaHref: '/services',
    secondaryCtaText: 'Get Free Quote',
    secondaryCtaHref: '/contact',
    image: '/images/hero-solar-engineering.webp',
    stats: [
      { label: 'Installed Capacity', value: '15+ MWp' },
      { label: 'Utility Bill Savings', value: 'Up to 70%' },
      { label: 'System Reliability', value: '99.8%' },
    ],
  },
  {
    id: 'smart-solar',
    badge: 'SMART SOLAR INSTALLATIONS',
    badgeIcon: <Zap className="w-4 h-4 text-[#ffc000]" />,
    badgeType: 'standard',
    title: 'Advanced On-Grid, Hybrid &',
    highlightText: 'Off-Grid Solar Power Systems',
    subtitle:
      'Engineered for maximum efficiency, zero-outage battery storage backup, and long-term net-metering energy cost reduction.',
    primaryCtaText: 'View Solar Systems',
    primaryCtaHref: '/services',
    secondaryCtaText: 'Consult Our Engineers',
    secondaryCtaHref: '/contact',
    image: '/images/hero-commercial-systems.webp',
    stats: [
      { label: 'Tier-1 Hardware', value: '25-Yr Warranty' },
      { label: 'Monitoring', value: '24/7 Smart Cloud' },
      { label: 'ROI Timeline', value: '3 - 5 Years' },
    ],
  },
  {
    id: 'floating-clean-tech',
    badge: 'INNOVATION IN CLEAN TECH',
    badgeIcon: <ShieldCheck className="w-4 h-4 text-[#ffc000]" />,
    badgeType: 'standard',
    title: 'Pioneering Floating Solar PV &',
    highlightText: 'Turnkey Commercial Micro-Grids',
    subtitle:
      'Leading sustainable engineering with water-reservoir floating solar arrays, micro-grids, and structured project financing up to 500MW capacity.',
    primaryCtaText: 'Our Installation Process',
    primaryCtaHref: '/services',
    secondaryCtaText: 'View Projects',
    secondaryCtaHref: '/projects',
    image: '/images/hero-floating-solars.webp',
    stats: [
      { label: 'Floating Solar', value: 'Prawn Farm' },
      { label: 'Funding Capacity', value: '315 kwp' },
      { label: 'Commercial Clients', value: '5+ Major Sites' },
    ],
  },
];

export default function HeroSlider() {
  const [latestTraining, setLatestTraining] = useState<TrainingItem>(initialTrainings[0]);
  const [latestNews, setLatestNews] = useState<NewsArticle>(fallbackNews[0]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 6500; // 6.5 seconds

  // Fetch latest training post dynamically from /api/trainings
  useEffect(() => {
    async function loadLatestTraining() {
      try {
        const res = await fetch('/api/trainings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.trainings) && data.trainings.length > 0) {
            const parsed = parseRawTrainings(data.trainings as TrainingRawInput[]);
            setLatestTraining(parsed[0]);
          }
        }
      } catch {
        // Fallback to initialTrainings[0]
      }
    }
    loadLatestTraining();
  }, []);

  // Fetch latest news post dynamically from /api/news
  useEffect(() => {
    async function loadLatestNews() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.news) && data.news.length > 0) {
            setLatestNews(data.news[0]);
          }
        }
      } catch {
        // Fallback to fallbackNews[0]
      }
    }
    loadLatestNews();
  }, []);

  // Construct dynamic slides array with latest training post and latest news post
  const slides: Slide[] = useMemo(() => {
    const list: Slide[] = [];

    // 1. Latest Training Slide
    if (latestTraining) {
      list.push({
        id: `training-${latestTraining.id}`,
        badge: latestTraining.badge ? latestTraining.badge.toUpperCase() : 'LATEST TECHNICAL TRAINING',
        badgeIcon: <GraduationCap className="w-4 h-4 text-[#ffc000]" />,
        badgeType: 'training',
        title: latestTraining.title,
        highlightText: 'Live Technical Workshop',
        subtitle:
          latestTraining.description ||
          'Hands-on technical capacity building, live floating solar demonstrations, and continuous engineering education.',
        primaryCtaText: 'Explore Trainings',
        primaryCtaHref: '/trainings',
        secondaryCtaText: 'Request Workshop',
        secondaryCtaHref: latestTraining.registrationUrl || '/contact',
        image: latestTraining.image || '/images/hero-floating-solar.jpg',
        videoUrl: latestTraining.videoUrl,
        isTraining: true,
        slideDate: latestTraining.date,
        slideLocation: latestTraining.location,
        slideHost: latestTraining.organizer,
        stats: [
          { label: 'Schedule', value: latestTraining.date ? latestTraining.date.split(',')[0] : 'Scheduled' },
          { label: 'Track / Category', value: latestTraining.category || 'Specialized' },
          {
            label: 'Partner / Host',
            value: latestTraining.organizer ? latestTraining.organizer.split('&')[0].trim() : 'GG Academy',
          },
        ],
      });
    }

    // 2. Latest News & Updates Slide
    if (latestNews) {
      list.push({
        id: `news-${latestNews.id}`,
        badge: `${latestNews.category.toUpperCase()} UPDATE`,
        badgeIcon: <Newspaper className="w-4 h-4 text-cyan-400" />,
        badgeType: 'news',
        title: latestNews.title,
        highlightText: 'Latest Announcement',
        subtitle:
          latestNews.summary ||
          'Stay informed with the latest renewable energy developments, international delegations, scholarship updates, and exhibitions.',
        primaryCtaText: 'Read Full News',
        primaryCtaHref: '/news-updates',
        secondaryCtaText: 'Inquire Details',
        secondaryCtaHref: '/contact',
        image: latestNews.image || '/images/news/tesda-scholarship.png',
        isNews: true,
        slideDate: latestNews.formattedDate || latestNews.date,
        slideLocation: latestNews.location,
        slideHost: latestNews.authorOrHost,
        stats: [
          { label: 'Category', value: latestNews.category },
          { label: 'Published Date', value: latestNews.formattedDate ? latestNews.formattedDate.split('(')[0].trim() : latestNews.date },
          { label: 'Host / Partner', value: latestNews.authorOrHost ? latestNews.authorOrHost.split('&')[0].trim() : 'GG Automation' },
        ],
      });
    }

    // Append core engineering slides
    return [...list, ...defaultBaseSlides];
  }, [latestTraining, latestNews]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

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
      className="relative bg-[#091833] text-white min-h-[660px] md:min-h-[740px] lg:min-h-[800px] flex items-center overflow-hidden"
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
          {/* Gradients Overlay for high-contrast readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#091833] via-[#091833]/90 to-[#091833]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-[#091833]/70" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
      ))}

      {/* Main Content Container with 2-Column Side-by-Side Showcase */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        {slides.map((slide, index) => {
          if (index !== currentSlide) return null;
          return (
            <div
              key={slide.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-fade-in"
            >
              {/* LEFT COLUMN: Main Slide Headline, Copy, CTAs, Metrics */}
              <div className="lg:col-span-7 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e51a24]/20 border border-[#e51a24]/50 backdrop-blur-md">
                  {slide.badgeIcon}
                  <span className="text-xs md:text-sm font-bold tracking-widest text-[#ffc000] uppercase">
                    {slide.badge}
                  </span>
                  {slide.isTraining && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
                      NEW /TRAININGS
                    </span>
                  )}
                  {slide.isNews && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                      NEW /NEWS-UPDATES
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-black text-white leading-[1.15] tracking-tight line-clamp-3">
                  {slide.title}{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffc000] via-amber-300 to-[#e51a24] block sm:inline">
                    {slide.highlightText}
                  </span>
                </h1>

                {/* Subtitle / Description */}
                <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl line-clamp-3">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.primaryCtaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg hover:shadow-red-600/30 transition-all duration-200 group hover:scale-105"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>

                {/* Key Metrics Bar */}
                <div className="pt-6 grid grid-cols-3 gap-3 md:gap-6 border-t border-white/15 max-w-xl">
                  {slide.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="text-base sm:text-xl md:text-2xl font-black text-[#ffc000] truncate">
                        {stat.value}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Same Uploaded Image Beside Content in Left */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-900/80 shadow-2xl backdrop-blur-xl group/card hover:border-[#ffc000]/50 transition-all duration-500">
                  <div className="relative h-80 sm:h-[400px] w-full overflow-hidden bg-slate-950">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1200px) 50vw, 40vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Floating Badge on Image Card */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
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

                      {slide.slideDate && (
                        <span className="bg-cyan-500/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{slide.slideDate}</span>
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
                        className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e51a24] to-[#ffc000] text-white shadow-2xl flex items-center justify-center group-hover/play:scale-110 active:scale-95 transition-all">
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </div>
                      </a>
                    ) : null}

                    {/* Bottom Card Caption Details */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-2">
                      <div className="text-xs font-black text-white line-clamp-1">
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <div className="absolute z-30 bottom-8 right-8 hidden md:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffc000] cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer"
          aria-label={isPaused ? 'Play Autoplay' : 'Pause Autoplay'}
          title={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
        >
          {isPaused ? <Play className="w-4 h-4 text-[#ffc000]" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-[#e51a24] text-white border border-white/20 backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ffc000] cursor-pointer"
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
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
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
