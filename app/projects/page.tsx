import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectsSection from '@/components/ProjectsSection';
import { ChevronRight, Award, ShieldCheck, Zap, Sparkles, Building2, Factory, Home, GraduationCap, Hospital } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar & Engineering Projects Portfolio | GG Automation Construction Services',
  description:
    'Explore GG Automation Construction Services portfolio of turnkey solar PV and electrical engineering projects across Residential, Commercial, School, Industrial, and Hospital categories in the Philippines.',
};

const categoryBadges = [
  { icon: <Home className="w-3.5 h-3.5 text-[#0b7337]" />, label: 'Residential' },
  { icon: <Building2 className="w-3.5 h-3.5 text-[#e51a24]" />, label: 'Commercial' },
  { icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />, label: 'Schools & Universities' },
  { icon: <Factory className="w-3.5 h-3.5 text-[#ffc000]" />, label: 'Industrial & Floating PV' },
  { icon: <Hospital className="w-3.5 h-3.5 text-rose-400" />, label: 'Hospitals & Healthcare' },
];

export default function ProjectsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Hero Banner */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-20 overflow-hidden border-b border-white/10">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b7337]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e51a24]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">Projects</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Our Engineering Projects Portfolio
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Proven track record of high-yield solar PV installations, floating solar innovations, high-voltage transformer engineering, and preventive maintenance across the Philippines.
          </p>

          {/* Quick Category Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-300">
            {categoryBadges.map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200"
              >
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Filterable Projects Section */}
      <ProjectsSection />
    </div>
  );
}
