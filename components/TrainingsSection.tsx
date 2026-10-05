'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Sparkles,
  Waves,
  Users,
  ArrowRight,
  Play,
  ExternalLink,
  ShieldCheck,
  Zap,
  GraduationCap,
  Layers,
  CheckCircle2,
  Search,
  X,
  Building2,
  BookOpen,
  Maximize2
} from 'lucide-react';
import { initialTrainings, parseRawTrainings, TrainingItem, TrainingRawInput } from '@/data/trainingsData';

const categories = [
  'All',
  'Featured Milestone',
  'Specialized Track',
  'EPC Core',
  'Safety & Compliance',
  'Regulatory & Utility',
  'Hands-on Workshop',
];

export default function TrainingsSection() {
  const [trainings, setTrainings] = useState<TrainingItem[]>(initialTrainings);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainingModal, setSelectedTrainingModal] = useState<TrainingItem | null>(null);

  // Fetch updated trainings from database API
  useEffect(() => {
    async function loadTrainings() {
      try {
        const res = await fetch('/api/trainings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.trainings)) {
            setTrainings(parseRawTrainings(data.trainings as TrainingRawInput[]));
          }
        }
      } catch (err) {
        console.warn('Using fallback local trainings dataset', err);
      }
    }
    loadTrainings();
  }, []);

  // Filtered list
  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        t.category.toLowerCase() === selectedCategory.toLowerCase() ||
        t.badge.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.organizer.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.topics.some((tp) => tp.toLowerCase().includes(q)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [trainings, selectedCategory, searchQuery]);

  // Always pick the latest training program for the featured "Live Demo & Seminar" milestone banner
  const featuredMilestone = useMemo(() => {
    return trainings[0] || null;
  }, [trainings]);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. FEATURED EVENT MILESTONE HERO BANNER (Latest Training / Live Demo)  */}
      {/* ---------------------------------------------------------------------- */}
      {featuredMilestone && (
        <section className="py-12 sm:py-16 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
            {/* Section Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e51a24]/10 border border-[#e51a24]/20 text-[#e51a24] text-xs font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24] animate-ping"></span>
                <span>{featuredMilestone.badge || 'LIVE DEMO & SEMINAR'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#091833] tracking-tight leading-tight">
                {featuredMilestone.organizer.includes('&') ? (
                  <>
                    <span className="block">{featuredMilestone.organizer.split('&')[0].trim()} &</span>
                    <span className="block mt-1 sm:mt-1.5">{featuredMilestone.organizer.split('&')[1].trim()}</span>
                  </>
                ) : (
                  featuredMilestone.organizer || 'Live Demo & Seminar'
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Latest practical demonstration and specialized technical workshop on solar engineering.
              </p>
              <div className="w-16 h-1 bg-[#e51a24] mx-auto rounded-full mt-2"></div>
            </div>

            {/* Highlight Event Card */}
            <div className="bg-slate-50/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Content Column */}
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* Event Tags & Date */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-200">
                      <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{featuredMilestone.date}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                      <span>{featuredMilestone.location}</span>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight leading-snug">
                    {featuredMilestone.title}
                  </h3>

                  {/* Event Description */}
                  <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    <p>{featuredMilestone.description}</p>
                    <p className="text-xs sm:text-sm text-slate-500 italic pt-1 border-t border-slate-200">
                      Collaboration with <strong className="text-[#0b7337] font-semibold not-italic">{featuredMilestone.organizer}</strong> for engineering capability development.
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  {featuredMilestone.topics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-slate-800">
                      {featuredMilestone.topics.slice(0, 4).map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                  {featuredMilestone.videoUrl && (
                    <a
                      href={featuredMilestone.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-md transition-all hover:scale-105"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Watch Video on Facebook</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-all"
                  >
                    <span>Inquire Future Workshops</span>
                    <ArrowRight className="w-4 h-4 text-[#e51a24]" />
                  </Link>
                </div>
              </div>

              {/* Right Media Column */}
              <div className="lg:col-span-6 relative bg-slate-950 flex flex-col justify-center items-center min-h-[360px] lg:min-h-[480px] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 group">
                <Image
                  src={featuredMilestone.image || '/images/hero-floating-solar.jpg'}
                  alt={featuredMilestone.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40"></div>

                <div className="relative z-10 text-center space-y-5 max-w-md mx-auto p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30">
                    <Waves className="w-3.5 h-3.5" />
                    <span>Live Demo & Seminar Preview</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
                      {featuredMilestone.title}
                    </h4>
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-widest text-[#ffc000]">
                      {featuredMilestone.badge || 'SEMINAR AND TRAINING'}
                    </p>
                  </div>

                  {featuredMilestone.videoUrl ? (
                    <a
                      href={featuredMilestone.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Play Video"
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#e51a24] to-[#ffc000] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 mx-auto group/btn cursor-pointer"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                    </a>
                  ) : (
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white border border-white/20">
                      <GraduationCap className="w-8 h-8 text-[#ffc000]" />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400">
                    {featuredMilestone.videoUrl
                      ? 'Click to watch the full seminar video clip & lake demonstration'
                      : 'Comprehensive technical syllabus & practical field workshop'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. DYNAMIC WORKSHOPS & CURRICULUM CATALOG                               */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 sm:py-20 bg-[#091833] relative overflow-hidden border-b border-white/10">
        {/* Background Image with Ambient Glows */}
        <Image
          src="/images/training-bg.webp"
          alt="Solar Training Background"
          fill
          className="object-cover object-center opacity-40 pointer-events-none"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#091833]/90 via-[#091833]/70 to-[#091833]/95 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffc000]/15 border border-[#ffc000]/30 text-[#ffc000] text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>TRAINING PROGRAMS & SEMINARS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Comprehensive Solar & Electrical Training Portfolio
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Customized technical packages tailored for engineering students, licensed electricians, municipal LGU planners, and corporate facility engineers.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#ffc000] text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, tracks, locations..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ffc000] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Trainings Grid Cards */}
          {filteredTrainings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-white">No training programs match your filter</div>
              <p className="text-xs text-slate-400">Try clearing your search query or selecting &quot;All&quot; categories.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#0b7337] text-white text-xs font-bold hover:bg-[#0e9447] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
              {filteredTrainings.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/85 hover:bg-slate-900/98 border border-white/10 hover:border-[#0b7337]/60 rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Header Badges & Icon */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#ffc000] bg-[#ffc000]/15 border border-[#ffc000]/30 px-3 py-1 rounded-full">
                          {item.badge}
                        </span>
                        <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                          {item.category}
                        </span>
                      </div>

                      {item.videoUrl && (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Watch Live Video"
                          className="p-1.5 rounded-full bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </a>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-[#ffc000] transition-colors">
                      {item.title}
                    </h3>

                    {/* Metadata: Date & Location */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#e51a24] flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{item.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Core Modules / Topics Covered */}
                    {item.topics.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Core Modules Covered:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.topics.map((topic, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="truncate">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer CTA & Modal Open */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                    <span className="text-slate-400 text-[11px]">{item.targetAudience}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTrainingModal(item)}
                        className="text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        Details
                      </button>
                      <Link
                        href={item.registrationUrl || '/contact'}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white hover:scale-105 transition-all shadow-md flex items-center gap-1"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. DETAILS MODAL                                                       */}
      {/* ---------------------------------------------------------------------- */}
      {selectedTrainingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-[#061021] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0b7337] flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#ffc000]">{selectedTrainingModal.badge}</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedTrainingModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrainingModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
                <Image
                  src={selectedTrainingModal.image || '/images/hero-floating-solar.jpg'}
                  alt={selectedTrainingModal.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Date & Schedule:</span>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedTrainingModal.date}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Location:</span>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                    <span>{selectedTrainingModal.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">About the Program</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {selectedTrainingModal.description}
                </p>
              </div>

              {selectedTrainingModal.topics.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Curriculum Topics Covered</span>
                  <div className="space-y-1.5">
                    {selectedTrainingModal.topics.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#061021] border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => setSelectedTrainingModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-300 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedTrainingModal.videoUrl && (
                  <a
                    href={selectedTrainingModal.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:bg-[#166fe5] transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Video</span>
                  </a>
                )}
                <Link
                  href={selectedTrainingModal.registrationUrl || '/contact'}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>Inquire Training</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
