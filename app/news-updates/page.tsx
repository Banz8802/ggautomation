'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProcessSection from '@/components/ProcessSection';
import { newsArticles, NewsArticle } from '@/data/newsData';
import { 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Search,
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
  Award
} from 'lucide-react';

export default function NewsUpdatesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(newsArticles);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Fetch updated news from /api/news
  React.useEffect(() => {
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

  const categories = ['All', 'Scholarship', 'Global Tour', 'Exhibition', 'Technical Seminar'];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' ? true : article.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authorOrHost.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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
          
          {/* Controls: Category Filter Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-full md:w-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === 'All' ? newsArticles.length : newsArticles.filter((n) => n.category === cat).length;
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

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search news, events, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#e51a24] focus:bg-white text-xs text-slate-800 outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* News Articles Grid (Latest Date on Top) */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-lg font-bold text-slate-700">No articles found</h4>
              <p className="text-xs text-slate-500">Try adjusting your search or category filter.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#091833] text-white text-xs font-bold"
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
                    {/* Article Image Banner */}
                    <div 
                      className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer select-none group/img"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/90 via-[#091833]/20 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e51a24] text-white shadow-md">
                          {article.category}
                        </span>
                      </div>

                      {/* Date & Location Overlay on Image Bottom */}
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
                        <div className="flex items-center gap-1.5 font-bold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-[#ffc000]" />
                          <span>{article.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-200 text-[11px] font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[220px]">
                          <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                          <span className="truncate">{article.location}</span>
                        </div>
                      </div>
                    </div>

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
          onClick={() => setSelectedArticle(null)}
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
                <span className="text-xs text-slate-300 font-semibold">
                  {selectedArticle.formattedDate}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 [scrollbar-width:thin]">
              
              {/* Media Image */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="object-contain sm:object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0b7337] uppercase tracking-wider">
                  {selectedArticle.authorOrHost}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                  <span>{selectedArticle.location}</span>
                </div>
              </div>

              {/* Full Paragraphs */}
              <div className="space-y-3.5 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4">
                {selectedArticle.fullContent.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
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
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all"
              >
                Close
              </button>
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
