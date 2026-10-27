'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ProcessSection from '@/components/ProcessSection';
import RichText from '@/components/RichText';
import { newsArticles, NewsArticle, getArticleImages } from '@/data/newsData';
import { 
  ChevronLeft,
  ChevronRight, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Filter,
  CheckCircle2,
  Share2,
  X,
  Phone,
  Mail,
  GraduationCap,
  Globe2,
  Building2,
  Layers,
  Award,
  RefreshCw,
  Clock,
  Maximize2
} from 'lucide-react';

interface ArticleCardImageSliderProps {
  images: string[];
  title: string;
  category: string;
  isUpcomingEvent?: boolean;
  isPastEvent?: boolean;
  displayDates?: string[];
  formattedDate?: string;
  locations?: string[];
  location?: string;
  onOpenModal: () => void;
}

function ArticleCardImageSlider({
  images,
  title,
  category,
  isUpcomingEvent,
  isPastEvent,
  displayDates,
  formattedDate,
  locations,
  location,
  onOpenModal,
}: ArticleCardImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic continuous slide loop every 3.5s if multiple images exist
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  return (
    <div
      className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer select-none group/img"
      onClick={onOpenModal}
    >
      {/* Loop Images with Smooth Crossfade */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={img}
            alt={`${title} - image ${idx + 1}`}
            fill
            className="object-cover object-top group-hover/img:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={idx === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#091833]/90 via-[#091833]/25 to-transparent pointer-events-none" />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e51a24] text-white shadow-md">
          {category}
        </span>
        {isUpcomingEvent ? (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1 shadow-emerald-950/40 animate-pulse">
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>Upcoming Event</span>
          </span>
        ) : isPastEvent ? (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-700/80 text-slate-200 border border-slate-500/50 shadow-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>Past Event</span>
          </span>
        ) : null}
      </div>

      {/* Multiple Images Indicator (Top Right) */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white shadow-lg pointer-events-none">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-wider">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Manual Slide Controls on Hover */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-[#e51a24] text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-[#e51a24] text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Progress Dots */}
          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 h-1.5 bg-[#ffc000] shadow-[0_0_8px_rgba(255,192,0,0.6)]'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Date & Location Overlay on Image Bottom */}
      <div className="absolute bottom-3 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2 text-white text-xs pointer-events-none">
        <div className="flex items-center gap-1.5 font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
          <span>
            {displayDates && displayDates.length > 0 ? displayDates.join(' • ') : formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-200 text-[11px] font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[200px]">
          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
          <span className="truncate">
            {locations && locations.length > 0 ? locations.join(' • ') : location}
          </span>
        </div>
      </div>
    </div>
  );
}

function NewsUpdatesPageContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams?.get('id') || searchParams?.get('article');
  const [articles, setArticles] = useState<NewsArticle[]>(newsArticles);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Keyboard navigation for fullscreen slideshow (Escape to close, Left/Right to change)
  useEffect(() => {
    if (!isSlideshowOpen || !selectedArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const imgs = getArticleImages(selectedArticle);
      if (e.key === 'Escape') {
        setIsSlideshowOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSlideshowIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
      } else if (e.key === 'ArrowRight') {
        setSlideshowIndex((prev) => (prev + 1) % imgs.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideshowOpen, selectedArticle]);

  // Fetch updated news from /api/news
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.news) && data.news.length > 0) {
            setArticles(data.news);
          }
        }
      } catch (err) {
        console.warn('Using fallback news articles dataset', err);
      }
    }
    loadNews();
  }, []);

  // Automatically open article modal if matching id query param exists
  useEffect(() => {
    if (articleId && articles.length > 0) {
      const match = articles.find(
        (a) =>
          a.id === articleId ||
          a.id.toLowerCase() === articleId.toLowerCase()
      );
      if (match) {
        setSelectedArticle(match);
        setModalImageIndex(0);
      }
    }
  }, [articleId, articles]);

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setModalImageIndex(0);
    setIsSlideshowOpen(false);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const categories = [
    'All',
    'Scholarship',
    'Global Tour',
    'Exhibition',
    'Technical Seminar',
    'Company Milestone',
    'General Update',
  ];

  const filteredArticles = articles.filter((article) => {
    return activeCategory === 'All' ? true : article.category === activeCategory;
  });

  return (
    <div className="bg-[#091833] min-h-screen text-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Hero Header Banner                                                         */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-20 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e51a24]/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0b7337]/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">News & Updates</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            News, Events & Industry Updates
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stay informed with clean energy scholarships, international study tours, premier build expos, and renewable engineering milestones across the Philippines.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" />
              <span>TESDA Solar Scholarships</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 backdrop-blur-sm">
              <Globe2 className="w-4 h-4" />
              <span>International Tech Tours</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#ffc000] backdrop-blur-sm">
              <Building2 className="w-4 h-4" />
              <span>CEBUCON Trade Expos</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* News & Updates Grid Section (Clean White Background)                        */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          {/* Controls: Category Filter Tabs */}
          <div className="flex items-center justify-center pb-4 border-b border-slate-200">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-full sm:w-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === 'All' ? articles.length : articles.filter((n) => n.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#091833] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* News Articles Grid (Latest Date on Top) */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-lg font-bold text-slate-700">No articles found</h4>
              <p className="text-xs text-slate-500">Try selecting a different category filter.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="px-4 py-2 rounded-xl bg-[#091833] text-white text-xs font-bold cursor-pointer hover:bg-[#0d2247] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-slate-50/90 hover:bg-white border border-slate-200/90 hover:border-[#0b7337]/50 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Article Image Banner with Continuous Slide Loop */}
                    <ArticleCardImageSlider
                      images={getArticleImages(article)}
                      title={article.title}
                      category={article.category}
                      isUpcomingEvent={article.isUpcomingEvent}
                      isPastEvent={article.isPastEvent}
                      displayDates={article.displayDates}
                      formattedDate={article.formattedDate}
                      locations={article.locations}
                      location={article.location}
                      onOpenModal={() => setSelectedArticle(article)}
                    />

                    {/* Article Body Content */}
                    <div className="p-6 sm:p-8 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#0b7337] uppercase tracking-wider block">
                          {article.authorOrHost}
                        </span>
                        <h3 
                          className="text-xl sm:text-2xl font-black text-[#091833] tracking-tight leading-snug group-hover:text-[#e51a24] transition-colors cursor-pointer line-clamp-2"
                          onClick={() => setSelectedArticle(article)}
                        >
                          {article.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>

                      {/* Key Highlights */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Key Takeaways & Details:
                        </span>
                        <div className="space-y-1.5">
                          {article.highlights.slice(0, 3).map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0b7337] flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Article Footer Bar */}
                  <div className="px-6 sm:px-8 py-4 bg-slate-100/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 2).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e51a24] hover:text-[#091833] transition-colors group/btn cursor-pointer"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Full Article Lightbox Modal                                                */}
      {/* -------------------------------------------------------------------------- */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#091833] to-[#0d2247] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e51a24] text-white">
                  {selectedArticle.category}
                </span>
                {selectedArticle.isUpcomingEvent ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1 shadow-emerald-950/40">
                    <Sparkles className="w-3 h-3 text-emerald-200" />
                    <span>Upcoming Event</span>
                  </span>
                ) : selectedArticle.isPastEvent ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-700/80 text-slate-200 border border-slate-500/50 shadow-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>Past Event</span>
                  </span>
                ) : null}
                <span className="text-xs text-slate-300 font-semibold">
                  {selectedArticle.displayDates && selectedArticle.displayDates.length > 0
                    ? selectedArticle.displayDates.join(' • ')
                    : selectedArticle.formattedDate}
                </span>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 [scrollbar-width:thin]">
              
              {/* Media Gallery / Image Slider */}
              {(() => {
                const modalImages = getArticleImages(selectedArticle);
                const currentImg = modalImages[modalImageIndex] || modalImages[0] || selectedArticle.image;

                return (
                  <div className="space-y-3">
                    <div 
                      className="relative h-72 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 group/modalimg shadow-inner cursor-zoom-in"
                      onClick={() => {
                        setSlideshowIndex(modalImageIndex);
                        setIsSlideshowOpen(true);
                      }}
                      title="Click to view full image slideshow"
                    >
                      <Image
                        src={currentImg}
                        alt={selectedArticle.title}
                        fill
                        className="object-cover object-top transition-all duration-300 group-hover/modalimg:scale-[1.02]"
                        priority
                      />

                      {/* Top Right Zoom / Expand Prompt */}
                      <div className="absolute top-3 right-3 z-20 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-lg group-hover/modalimg:bg-[#e51a24] transition-colors pointer-events-none">
                        <Maximize2 className="w-3.5 h-3.5 text-[#ffc000]" />
                        <span>Click to view full image</span>
                      </div>

                      {modalImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer z-20"
                            aria-label="Previous photo"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalImageIndex((prev) => (prev + 1) % modalImages.length);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer z-20"
                            aria-label="Next photo"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20 z-20">
                            {modalImageIndex + 1} / {modalImages.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail strip if multiple images */}
                    {modalImages.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                        {modalImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setModalImageIndex(idx)}
                            className={`relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              idx === modalImageIndex
                                ? 'border-[#e51a24] scale-105 shadow-md ring-2 ring-[#e51a24]/30'
                                : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                            }`}
                          >
                            <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover object-top" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Title & Metadata */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0b7337] uppercase tracking-wider">
                  {selectedArticle.authorOrHost}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#e51a24] shrink-0" />
                  <span>
                    {selectedArticle.locations && selectedArticle.locations.length > 0
                      ? selectedArticle.locations.join(' • ')
                      : selectedArticle.location}
                  </span>
                </div>
              </div>

              {/* Full Paragraphs */}
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                {selectedArticle.fullContent.map((paragraph, pIdx) => (
                  <RichText key={pIdx} content={paragraph} className="text-slate-700" />
                ))}
              </div>

              {/* Detailed Highlights Checklist */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#091833]">
                  Key Information & Program Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
                  {selectedArticle.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0b7337] flex-shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact / Direct Links (if present) */}
              {selectedArticle.contactInfo && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[#0b7337] block">Direct Inquiry & Application:</span>
                    <div className="flex flex-wrap items-center gap-4 text-slate-700">
                      {selectedArticle.contactInfo.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#e51a24]" />
                          <span className="font-bold">{selectedArticle.contactInfo.phone}</span>
                        </div>
                      )}
                      {selectedArticle.contactInfo.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#0b7337]" />
                          <span>{selectedArticle.contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedArticle.contactInfo.facebookUrl && (
                    <a
                      href={selectedArticle.contactInfo.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1877F2] text-white font-bold hover:bg-[#166fe5] transition-all shadow-sm"
                    >
                      <span>Watch on Facebook</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {selectedArticle.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md transition-all"
              >
                <span>Inquire with GG Automation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* Fullscreen Image Slideshow Lightbox                                        */}
      {/* Click ANYWHERE on screen to close, perfectly fit on mobile/desktop        */}
      {/* -------------------------------------------------------------------------- */}
      {isSlideshowOpen && selectedArticle && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 select-none cursor-pointer"
          onClick={() => setIsSlideshowOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar with title, image counter and close button */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e51a24] text-white shadow-md">
                {selectedArticle.category}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white/90 truncate max-w-[180px] sm:max-w-md">
                {selectedArticle.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                {slideshowIndex + 1} / {getArticleImages(selectedArticle).length}
              </span>
              <button
                type="button"
                onClick={() => setIsSlideshowOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors pointer-events-auto cursor-pointer"
                title="Close Slideshow (Click anywhere)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Container - Fit on screen without overflow, perfectly responsive on mobile */}
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
            {(() => {
              const images = getArticleImages(selectedArticle);
              const activeImg = images[slideshowIndex] || images[0];

              return (
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={activeImg}
                    alt={`${selectedArticle.title} - photo ${slideshowIndex + 1}`}
                    className="max-h-[80vh] sm:max-h-[85vh] max-w-[95vw] sm:max-w-[90vw] w-auto h-auto object-contain rounded-lg sm:rounded-2xl shadow-2xl transition-all duration-300"
                  />
                </div>
              );
            })()}

            {/* Left / Right Navigation Arrows (with stopPropagation) */}
            {getArticleImages(selectedArticle).length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const imgs = getArticleImages(selectedArticle);
                    setSlideshowIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer border border-white/20 z-30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const imgs = getArticleImages(selectedArticle);
                    setSlideshowIndex((prev) => (prev + 1) % imgs.length);
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-[#e51a24] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer border border-white/20 z-30"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Bar: Instructions / Thumbnail Dots */}
          <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center justify-center p-3 sm:p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
            {getArticleImages(selectedArticle).length > 1 && (
              <div className="flex items-center gap-2 pb-2 pointer-events-auto">
                {getArticleImages(selectedArticle).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideshowIndex(idx);
                    }}
                    className={`transition-all rounded-full cursor-pointer ${
                      idx === slideshowIndex
                        ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#e51a24]'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide flex items-center gap-1.5">
              <span>Click anywhere to close</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* Our Turnkey Engineering Process (ProcessSection)                            */}
      {/* -------------------------------------------------------------------------- */}
      <ProcessSection />

      {/* -------------------------------------------------------------------------- */}
      {/* Bottom Consultation & Proposal CTA Banner                                  */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 bg-gradient-to-b from-[#091833] to-[#040812] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-slate-900 via-[#0b7337]/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Partner with Licensed Clean Energy Engineers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto">
              Ready to Collaborate or Design Your Clean Energy Project?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Connect with our PRC-licensed solar and electrical engineering team for technical feasibility audits, training partnerships, and turnkey EPC designs.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-xl hover:shadow-red-950/40 transition-all hover:scale-105"
              >
                <span>Send Project Inquiry</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>Browse Projects Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function NewsUpdatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#091833] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#ffc000] animate-spin" />
            <span className="text-white text-sm font-semibold tracking-wider">Loading News &amp; Updates...</span>
          </div>
        </div>
      }
    >
      <NewsUpdatesPageContent />
    </Suspense>
  );
}
