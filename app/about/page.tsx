import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AboutSection from '@/components/AboutSection';
import VisionMissionSection from '@/components/VisionMissionSection';
import ProcessSection from '@/components/ProcessSection';
import { ChevronRight, Award, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | GG Automation Construction Services - Solar EPC & Engineering',
  description:
    'Learn about GG Automation Construction Services, a licensed renewable energy EPC contractor in the Philippines specializing in rooftop solar PV, floating solar systems, and high-voltage electrical engineering.',
};

export default function AboutPage() {
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
            <span className="text-[#ffc000]">About Us</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            About GG Automation Construction Services
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sustainability Specialist & Licensed Engineering Partner delivering certified turnkey solar EPC, high-voltage substations, and energy efficiency solutions across the Philippines.
          </p>

          {/* Quick Credential Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>PRC-Licensed Engineers</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[#ffc000]">
              <Award className="w-4 h-4" />
              <span>Tier-1 Solar Hardware</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-400">
              <Zap className="w-4 h-4" />
              <span>PEC & IEEE Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <AboutSection />

      {/* Vision, Mission & Core Values */}
      <VisionMissionSection />

      {/* Engineering Turnkey Workflow Process */}
      <ProcessSection />
    </div>
  );
}
