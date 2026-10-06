'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Mail,
  Sparkles,
  Copy,
  Check,
  FileText,
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { initialCareersData, CareersData, JobItem } from '@/data/careersData';

export default function CareersSection() {
  const [careersData, setCareersData] = useState<CareersData>(initialCareersData);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await fetch('/api/careers');
        const data = await res.json();
        if (data.success && data.careers) {
          setCareersData(data.careers);
        }
      } catch (err) {
        console.error('Failed to fetch careers:', err);
      }
    }
    loadCareers();
  }, []);

  const { pageSettings, jobs } = careersData;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(pageSettings.applicationEmail || 'Info@ggautomation.tech');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const departments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = jobs.filter((j) => {
    if (activeDepartment === 'All') return true;
    return j.department === activeDepartment;
  });

  return (
    <div className="pb-20">
      {/* ---------------------------------------------------------------------- */}
      {/* 0. DYNAMIC HERO BANNER WITH UPLOADED BANNER IMAGE                      */}
      {/* ---------------------------------------------------------------------- */}
      <section className="relative bg-[#091833] text-white py-16 sm:py-28 overflow-hidden border-b border-white/10">
        {/* Hero Background Image - High Clarity */}
        <div className="absolute inset-0 z-0">
          <Image
            src={pageSettings.bannerImage || '/images/hero-career.webp'}
            alt="GG Automation Careers Banner"
            fill
            priority
            className="object-cover opacity-85 filter brightness-105 contrast-105 scale-100"
          />
          {/* Subtle balanced gradient overlay for maximum clarity and text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-slate-950/35 to-slate-950/40"></div>
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/20 to-slate-950/50"></div>
        </div>

        {/* Ambient Atmospheric Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e51a24]/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0b7337]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
          {/* Breadcrumb Navigation */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 bg-black/50 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#ffc000] font-bold">Careers & Hiring</span>
          </nav>

          {/* Hiring Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#e51a24] text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-2xl shadow-red-950/60 border border-red-400/40">
              <Sparkles className="w-4 h-4" />
              <span>{pageSettings.badge || 'WE ARE HIRING!'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            {pageSettings.title || 'Join Our Growing Team & Grow With Us'}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
            {pageSettings.subtitle ||
              "Looking for a start of your career opportunity? We're expanding our team and looking for motivated, hardworking, and passionate individuals to join us!"}
          </p>

          {/* Quick Info Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white backdrop-blur-md shadow-lg">
              <MapPin className="w-4 h-4 text-[#ffc000]" />
              <span>{pageSettings.location || 'Cebu City, Philippines'}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-[#ffc000] backdrop-blur-md shadow-lg">
              <Briefcase className="w-4 h-4" />
              <span>Full-Time Positions Available</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-emerald-400 backdrop-blur-md shadow-lg">
              <Mail className="w-4 h-4" />
              <span>{pageSettings.applicationEmail || 'Info@ggautomation.tech'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. CAREER OPPORTUNITIES / OPEN POSITIONS (WHITE BACKGROUND)            */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white text-slate-900 py-16 sm:py-20 border-b border-slate-200">
        <section id="open-positions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b7337]/10 border border-[#0b7337]/20 text-[#0b7337] text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#0b7337]" />
                  <span>Career Opportunities</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
                  Current Job Openings
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Explore open positions in our Cebu City headquarters and start your application today.
                </p>
              </div>

              {/* Department Filter Tabs */}
              {departments.length > 2 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveDepartment(dept)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeDepartment === dept
                        ? 'bg-[#e51a24] text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Postings Cards - Side by Side Layout */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-800">No active job listings found</div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We are always open to talented individuals. Send your spontaneous resume to{' '}
                <span className="text-[#e51a24] font-semibold">{pageSettings.applicationEmail}</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredJobs.map((job) => {
                const jobBanner = job.bannerImage || job.image || pageSettings.bannerImage || '/images/hero-career.webp';
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl border border-slate-200 text-slate-900 shadow-xl overflow-hidden flex flex-col md:flex-row hover:border-[#e51a24]/60 hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Left: Complete Image / Flyer Display (Beside Content) */}
                    <div className="md:w-5/12 lg:w-4/12 bg-gradient-to-br from-slate-950 via-[#061021] to-[#091833] relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden flex-shrink-0">
                      <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] rounded-2xl overflow-hidden">
                        <Image
                          src={jobBanner}
                          alt={job.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* Quick Badge overlay on image */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                          {job.department}
                        </span>
                      </div>
                    </div>

                    {/* Right: Job Details Content */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        {/* Header Info & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-[#0b7337] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            {job.department}
                          </span>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                              job.status === 'Open'
                                ? 'bg-[#0b7337] text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {job.status === 'Open' ? '● Actively Hiring' : '○ Closed'}
                          </span>
                        </div>

                        {/* Title & Metadata Pills */}
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight group-hover:text-[#e51a24] transition-colors">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold text-slate-600">
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                              <span>{job.location}</span>
                            </span>
                            <span className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#0b7337]" />
                              <span>{job.type}</span>
                            </span>
                            {job.experience && (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                                <span>{job.experience}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Preference notice */}
                        {job.preference && (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>{job.preference}</span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-sm text-slate-600 leading-relaxed font-normal">
                          {job.description}
                        </p>

                        {/* Key Requirements List */}
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              Key Requirements:
                            </div>
                            <ul className="space-y-1.5">
                              {job.requirements.slice(0, 4).map((req, idx) => (
                                <li key={idx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                                  <span className="text-[#e51a24] font-bold mt-0.5">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
                        <a
                          href={`mailto:${pageSettings.applicationEmail || 'Info@ggautomation.tech'}?subject=Application for ${encodeURIComponent(job.title)} - GG Automation Careers`}
                          className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md hover:shadow-red-600/30 transition-all cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Apply via Email</span>
                        </a>
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. APPLICATION INSTRUCTIONS BANNER                                     */}
      {/* ---------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="bg-gradient-to-r from-slate-900 via-[#0b7337]/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>How to Apply</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto">
            Your career opportunity is just one application away!
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {pageSettings.applicationInstructions ||
              'Send your updated resume and cover letter to our recruitment team. Please indicate the position you are applying for in the email subject line.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${pageSettings.applicationEmail || 'Info@ggautomation.tech'}?subject=General Application - GG Automation Team`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-xl hover:shadow-red-950/40 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>Send Resume to {pageSettings.applicationEmail || 'Info@ggautomation.tech'}</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Email Address'}</span>
            </button>
            {pageSettings.posterImage && (
              <button
                onClick={() => setIsPosterModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-[#ffc000] hover:bg-[#e6ad00] text-slate-900 shadow-lg transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Hiring Flyer Poster</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. MODAL: FULL JOB SPECIFICATION                                      */}
      {/* ---------------------------------------------------------------------- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto text-slate-900 shadow-2xl relative border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            {/* Modal Image Flyer Column (Whole Image Display) */}
            <div className="md:w-5/12 bg-gradient-to-br from-slate-950 via-[#061021] to-[#091833] relative min-h-[300px] sm:min-h-[380px] p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 flex-shrink-0">
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] rounded-2xl overflow-hidden">
                <Image
                  src={selectedJob.bannerImage || selectedJob.image || pageSettings.bannerImage || '/images/hero-career.webp'}
                  alt={selectedJob.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                  {selectedJob.department}
                </span>
              </div>
            </div>

            {/* Modal Content Column */}
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0b7337] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                    {selectedJob.department}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#091833]">
                    {selectedJob.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                    <span>{selectedJob.location}</span>
                  </span>
                  <span className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0b7337]" />
                    <span>{selectedJob.type}</span>
                  </span>
                  {selectedJob.experience && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{selectedJob.experience}</span>
                    </span>
                  )}
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedJob.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedJob.status === 'Open' ? '● Open (Actively Hiring)' : '○ Closed'}
                  </span>
                </div>
                {selectedJob.experience && (
                  <span className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    {selectedJob.experience}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    selectedJob.status === 'Open'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {selectedJob.status === 'Open' ? '● Open (Actively Hiring)' : '○ Closed'}
                </span>
              </div>

              {selectedJob.preference && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{selectedJob.preference}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Role Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Responsibilities</h4>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0b7337] flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Qualifications & Skills</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#e51a24] flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={`mailto:${pageSettings.applicationEmail || 'Info@ggautomation.tech'}?subject=Application for ${encodeURIComponent(selectedJob.title)} - GG Automation Careers`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Resume via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 5. MODAL: POSTER / FLYER LIGHTBOX                                      */}
      {/* ---------------------------------------------------------------------- */}
      {isPosterModalOpen && pageSettings.posterImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/20 p-2 flex flex-col items-center">
            <button
              onClick={() => setIsPosterModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              ✕
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={pageSettings.posterImage}
                alt="Recruitment Flyer Poster"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
