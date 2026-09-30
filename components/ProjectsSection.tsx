'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Zap, 
  Building2,
  Home,
  Factory,
  GraduationCap,
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Check
} from 'lucide-react';

import { projects, ProjectItem, ProjectCategory } from '@/data/projectsData';
export type { ProjectItem, ProjectCategory };

const categoryTabs: { label: ProjectCategory; icon: React.ReactNode }[] = [
  { label: 'All', icon: <Layers className="w-4 h-4" /> },
  { label: 'Residential', icon: <Home className="w-4 h-4" /> },
  { label: 'Commercial', icon: <Building2 className="w-4 h-4" /> },
  { label: 'School', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Industrial', icon: <Factory className="w-4 h-4" /> },
];

/* -------------------------------------------------------------------------- */
/* Individual Project Card with Interactive Multi-Image Carousel              */
/* -------------------------------------------------------------------------- */
function ProjectCard({
  project,
  onOpenModal,
}: {
  project: ProjectItem;
  onOpenModal: (project: ProjectItem, initialIndex: number) => void;
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0b7337]/50 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/10 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5">
      <div>
        {/* Multi-Image Interactive Card Header */}
        <div 
          className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer select-none group/img"
          onClick={() => onOpenModal(project, activeImageIdx)}
        >
          <Image
            src={project.images[activeImageIdx]}
            alt={`${project.title} - Photo ${activeImageIdx + 1}`}
            fill
            className="object-cover group-hover/img:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/90 via-[#091833]/15 to-transparent pointer-events-none"></div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-[#091833] text-[11px] font-black px-3 py-1 rounded-full shadow-md">
              {project.category}
            </span>

            <div className="bg-[#e51a24] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
              <Zap className="w-3.5 h-3.5 fill-current text-[#ffc000]" />
              <span>{project.capacity}</span>
            </div>
          </div>

          {/* Multi-Image Navigation Controls on Card */}
          {project.images.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={prevImage}
                aria-label="Previous Project Image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-[#0b7337] text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/img:opacity-100 shadow-md hover:scale-110 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                aria-label="Next Project Image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-[#0b7337] text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover/img:opacity-100 shadow-md hover:scale-110 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Pagination */}
              <div className="absolute bottom-11 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                {project.images.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIdx === activeImageIdx ? 'w-5 bg-[#ffc000]' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Photo Counter Pill */}
          <div className="absolute top-14 left-4 bg-[#091833]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-sm">
            <Camera className="w-3 h-3 text-[#ffc000]" />
            <span>{activeImageIdx + 1} / {project.images.length} Photos</span>
          </div>

          {/* Expand Overlay Pill */}
          <div className="absolute top-14 right-4 bg-white/25 hover:bg-white/40 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3" />
            <span>Gallery</span>
          </div>

          {/* Location Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white flex items-center gap-1.5 text-xs font-semibold z-10 pointer-events-none">
            <MapPin className="w-4 h-4 text-[#ffc000] flex-shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0b7337] block">
              {project.client}
            </span>
            <h3 
              onClick={() => onOpenModal(project, activeImageIdx)}
              className="text-lg font-black text-[#091833] hover:text-[#0b7337] cursor-pointer transition-colors leading-snug line-clamp-2"
            >
              {project.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
            {project.description}
          </p>

          {/* Highlights List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {project.highlights.slice(0, 3).map((h, hIdx) => (
              <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0b7337] flex-shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Thumbnails Preview & Gallery Trigger */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-3">
        {/* Interactive Mini Thumbnail Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {project.images.slice(0, 5).map((imgSrc, imgIdx) => (
            <button
              key={imgIdx}
              onClick={() => setActiveImageIdx(imgIdx)}
              className={`relative h-10 w-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                imgIdx === activeImageIdx
                  ? 'border-[#0b7337] ring-1 ring-[#0b7337] scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={imgSrc}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}

          {project.images.length > 5 && (
            <button
              onClick={() => onOpenModal(project, 5)}
              className="h-10 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center flex-shrink-0"
            >
              +{project.images.length - 5}
            </button>
          )}

          <button
            onClick={() => onOpenModal(project, activeImageIdx)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#091833] text-slate-700 hover:text-white text-xs font-bold transition-all border border-slate-200 flex-shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#ffc000]" />
            <span>Details</span>
          </button>
        </div>

        {/* Tags & Inquire Link */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 2).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#e51a24] hover:text-[#091833] transition-colors group/link"
          >
            <span>Inquire</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Fullscreen Project Gallery Lightbox & Technical Spec Modal                 */
/* -------------------------------------------------------------------------- */
function ProjectModal({
  project,
  initialIndex,
  onClose,
}: {
  project: ProjectItem;
  initialIndex: number;
  onClose: () => void;
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(initialIndex);

  const prevPhoto = useCallback(() => {
    setActivePhotoIdx((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  }, [project.images.length]);

  const nextPhoto = useCallback(() => {
    setActivePhotoIdx((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  }, [project.images.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, prevPhoto, nextPhoto]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-slate-900 rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#091833] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#0b7337] text-white text-xs font-black">
              {project.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#ffc000]" />
              <span>{project.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Project Gallery Modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e51a24] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-grow">
          
          {/* Main Photo Viewer Row */}
          <div className="space-y-3">
            <div className="relative h-[320px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
              <Image
                src={project.images[activePhotoIdx]}
                alt={`${project.title} - Photo ${activePhotoIdx + 1}`}
                fill
                className="object-cover"
                priority
              />

              {/* Prev / Next Lightbox Overlay Arrows */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label="Previous Photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-[#0b7337] text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    aria-label="Next Photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-[#0b7337] text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Capacity Badge */}
              <div className="absolute top-4 right-4 bg-[#e51a24] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                <Zap className="w-4 h-4 fill-current text-[#ffc000]" />
                <span>{project.capacity}</span>
              </div>

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#ffc000]" />
                <span>Image {activePhotoIdx + 1} of {project.images.length}</span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {project.images.map((imgSrc, tIdx) => (
                <button
                  key={tIdx}
                  onClick={() => setActivePhotoIdx(tIdx)}
                  className={`relative h-16 w-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    tIdx === activePhotoIdx
                      ? 'border-[#0b7337] ring-2 ring-[#0b7337]/50 scale-105 shadow-md'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={imgSrc} alt="" fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>

          {/* Project Details & Technical Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4 border-t border-slate-200">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#0b7337] block">
                  {project.client}
                </span>
                <h2 className="text-2xl font-black text-[#091833]">
                  {project.title}
                </h2>
                <div className="text-xs font-bold text-[#e51a24] mt-0.5">
                  {project.systemType}
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {project.description}
              </p>

              {/* Engineering Highlights */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Key Technical Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-[#0b7337] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Metrics Box */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-[#091833] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffc000]" />
                <span>Project Specifications</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Installed Capacity:</span>
                  <span className="font-black text-[#e51a24] text-sm">{project.capacity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">System Architecture:</span>
                  <span className="font-bold text-slate-800 text-right">{project.systemType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Est. Annual Generation:</span>
                  <span className="font-bold text-[#0b7337]">{project.annualYield}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Environmental Impact:</span>
                  <span className="font-bold text-sky-600">{project.co2Offset}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Project Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {project.completionDate}
                  </span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg transition-all"
              >
                <span>Request Proposal for Similar Site</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main ProjectsSection Component                                             */
/* -------------------------------------------------------------------------- */
export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState<{ isOpen: boolean; project: ProjectItem | null; index: number }>({
    isOpen: false,
    project: null,
    index: 0,
  });

  const openModal = (project: ProjectItem, initialIndex: number) => {
    setModalState({ isOpen: true, project, index: initialIndex });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, project: null, index: 0 });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeTab === 'All' ? true : project.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.systemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="PORTFOLIO & TRACK RECORD"
          title="Featured Engineering Projects"
          subtitle="Explore our certified turnkey installations across Residential rooftops, Commercial centers, Schools & Universities, and Industrial facilities in the Philippines."
        />

        {/* Category Tabs & Search Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {categoryTabs.map((tab) => {
              const isActive = activeTab === tab.label;
              const count = tab.label === 'All' ? projects.length : projects.filter((p) => p.category === tab.label).length;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#091833] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-[#ffc000]' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
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

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, client, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#e51a24] focus:bg-white text-xs text-slate-800 outline-none transition-all"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-700">No projects found</h4>
            <p className="text-xs text-slate-500">Try adjusting your category filter or search terms.</p>
            <button
              onClick={() => {
                setActiveTab('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#091833] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenModal={openModal}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-[#091833] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b7337]/30 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ready for clean energy transition?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Have a Project in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Consult with our PRC-licensed solar engineers for a tailored site survey, solar feasibility report, and guaranteed payback calculations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg transition-all"
            >
              <span>Request Engineering Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Render Project Lightbox Modal when active */}
      {modalState.isOpen && modalState.project && (
        <ProjectModal
          project={modalState.project}
          initialIndex={modalState.index}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
