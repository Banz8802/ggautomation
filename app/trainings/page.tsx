import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProcessSection from '@/components/ProcessSection';
import { 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Waves, 
  Users, 
  ArrowRight, 
  Play, 
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  Zap,
  GraduationCap,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trainings & Seminars | GG Automation Construction Services',
  description:
    'Hands-on technical trainings, floating solar PV seminars, and clean energy workshops organized by GG Automation Construction Services and Power Ai Philippines.',
};

const curriculumModules = [
  {
    title: 'Floating Solar PV & Reservoir Engineering',
    badge: 'Specialized Track',
    description: 'Design mechanics, UV-stabilized HDPE pontoon anchoring, water cooling thermodynamic gains, and environmental impact audits on fresh water reservoirs.',
    icon: <Waves className="w-6 h-6 text-cyan-400" />,
    topics: ['Water-surface pontoon assembly', 'Anchor cable tension calculations', 'Submersible IP68 electrical protection', 'Evaporation suppression metrics']
  },
  {
    title: 'Commercial Rooftop PV & 3D CAD Modeling',
    badge: 'EPC Core',
    description: 'Advanced solar simulation utilizing PVsyst and Helioscope, structural roof load assessments, shading analysis, and equipment selection.',
    icon: <Sun className="w-6 h-6 text-[#ffc000]" />,
    topics: ['Structural load & wind resistance', 'Tier-1 inverter topology selection', 'PVsyst generation yield simulation', 'Bill of Materials & ROI optimization']
  },
  {
    title: 'High & Low Voltage Substation Testing (PEC)',
    badge: 'Safety & Compliance',
    description: 'Comprehensive electrical testing protocols for substations, transformer oil breakdown, insulation resistance (Megger), and protection relays.',
    icon: <Zap className="w-6 h-6 text-[#e51a24]" />,
    topics: ['Philippine Electrical Code (PEC) standards', 'Thermographic infrared scanning', 'Transformer turns ratio (TTR) & hipot', 'Grounding grid resistance measurements']
  },
  {
    title: 'Distribution Utility Net-Metering & Grid Sync',
    badge: 'Regulatory & Utility',
    description: 'Navigating regulatory approvals with VECO, Meralco, and local electric cooperatives (ECs), anti-islanding safety, and power quality compliance.',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    topics: ['Distribution impact studies (DIS)', 'Net-metering bi-directional metering', 'Grid synchronization & power factor', 'Interconnection protection schemes']
  }
];

function Sun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export default function TrainingsPage() {
  return (
    <div className="bg-[#091833] min-h-screen text-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Page Header Hero Banner                                                    */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-20 overflow-hidden border-b border-white/10">
        {/* Ambient Atmospheric Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e51a24]/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">Trainings & Seminars</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Technical Trainings & Seminars
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hands-on technical capacity building, live floating solar demonstrations, and continuous engineering education empowering engineers, LGUs, and clean energy developers across the Philippines.
          </p>

          {/* Key Credentials Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 backdrop-blur-sm">
              <Waves className="w-4 h-4" />
              <span>Live Floating Solar PV Demo</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#ffc000] backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Power Ai Philippines Collaboration</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>PEC & Safety Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Featured Seminar & Live Demo Section (Power Ai Philippines)               */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e51a24]/10 border border-[#e51a24]/20 text-[#e51a24] text-xs font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24] animate-ping"></span>
              <span>FEATURED EVENT MILESTONE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#091833] tracking-tight">
              Power Ai Philippines
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              On-site demonstration and specialized technical workshop on lake-reservoir floating solar engineering.
            </p>
            <div className="w-16 h-1 bg-[#e51a24] mx-auto rounded-full mt-2"></div>
          </div>

          {/* Highlight Event Card with Facebook Video Embed & Direct Link */}
          <div className="bg-slate-50/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                
                {/* Event Tags & Date */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-200">
                    <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                    <span>August 15, 2025</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                    <span>Chandava Lake Resort, Cavinti, Laguna</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight leading-snug">
                  Floating Solar PV Installation Techniques & Material Optimization
                </h3>

                {/* Event Description (matching user content) */}
                <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  <p>
                    A glimpse into our <strong className="text-[#091833] font-bold">Floating Solar PV Seminar & Live Demo</strong> held last <strong className="text-[#0b7337] font-bold">August 15, 2025</strong> at <strong className="text-[#091833] font-bold">Chandava Lake Resort, Cavinti, Laguna! 🌊☀️</strong>
                  </p>
                  <p>
                    It was an inspiring day filled with learning, hands-on activities, and the exciting showcase of floating solar installation directly on the water.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 italic pt-1 border-t border-slate-200">
                    Huge thanks to our speakers, participants, and <strong className="text-[#0b7337] font-semibold not-italic">Power Philippines</strong> for being part of this successful milestone!
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                    <span>Water-Surface Anchoring Mechanics</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#0b7337] flex-shrink-0" />
                    <span>High-Efficiency Water Cooling</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Anti-Corrosive Marine Hardware</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Hands-On Assembly Demonstration</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.facebook.com/watch/?v=764063712674607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-md transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Watch Video on Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-all"
                >
                  <span>Inquire Future Workshops</span>
                  <ArrowRight className="w-4 h-4 text-[#e51a24]" />
                </Link>
              </div>

            </div>

            {/* Right Video / Media Card Column */}
            <div className="lg:col-span-6 relative bg-slate-950 flex flex-col justify-center items-center min-h-[360px] lg:min-h-[480px] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 group">
              {/* Background Cover Image */}
              <Image
                src="/images/hero-floating-solar.jpg"
                alt="Floating Solar PV Installation Techniques & Material Optimization Seminar 2025"
                fill
                className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40"></div>

              {/* Video Overlay Content */}
              <div className="relative z-10 text-center space-y-5 max-w-md mx-auto p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30">
                  <Waves className="w-3.5 h-3.5" />
                  <span>Floating Solar Event Preview</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-black text-white leading-snug">
                    Floating Solar PV Installation Techniques & Material Optimization
                  </h4>
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest text-[#ffc000]">
                    SEMINAR AND TRAINING 2025
                  </p>
                </div>

                {/* Big Play Button Linking to Video */}
                <a
                  href="https://www.facebook.com/watch/?v=764063712674607"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Play Floating Solar Facebook Video"
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#e51a24] to-[#ffc000] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 mx-auto group/btn cursor-pointer"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
                </a>

                <p className="text-[11px] text-slate-400">
                  Click to watch the full seminar video clip & lake demonstration on Facebook Watch
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Training Programs & Workshop Curriculum Offered                             */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#091833] relative overflow-hidden border-b border-white/10">
        {/* Background Image with Crisp Clarity & Atmospheric Glows */}
        <Image
          src="/images/training-bg.webp"
          alt="Solar Training Background"
          fill
          className="object-cover object-center opacity-65 pointer-events-none"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#091833]/75 via-[#091833]/50 to-[#091833]/85 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none"></div>

        {/* Ambient Halo Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#ffc000]/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-[-100px] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute top-10 right-[-100px] w-[500px] h-[500px] bg-[#0b7337]/20 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffc000]/15 border border-[#ffc000]/30 text-[#ffc000] text-xs font-black uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>TECHNICAL CURRICULUM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Comprehensive Solar & Electrical Training Programs
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Customized training packages tailored for engineering students, licensed electricians, municipal LGU planners, and corporate facility engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {curriculumModules.map((module, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/80 hover:bg-slate-900/95 border border-white/10 hover:border-[#0b7337]/50 rounded-3xl p-7 sm:p-8 space-y-5 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                      {module.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      {module.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {module.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {module.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Modules Covered:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {module.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Available for Corporate & Academic Groups</span>
                  <Link
                    href="/contact"
                    className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 transition-colors group/link"
                  >
                    <span>Request Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Our Turnkey Engineering Process (ProcessSection)                            */}
      {/* -------------------------------------------------------------------------- */}
      <ProcessSection />

      {/* -------------------------------------------------------------------------- */}
      {/* Bottom Consultation & Training Request CTA Banner                          */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 bg-gradient-to-b from-[#091833] to-[#040812] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-slate-900 via-[#0b7337]/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Upskill Your Team & Engineers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto">
              Host a Custom Solar Training or Workshop with GG Automation
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              We provide customized on-site and classroom technical training for corporate facility teams, engineering faculties, and clean energy developers.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-xl hover:shadow-red-950/40 transition-all hover:scale-105"
              >
                <span>Request Custom Training / Seminar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>View Our Projects Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
