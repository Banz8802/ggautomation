import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ServicesSection from '@/components/ServicesSection';
import SolarSystemsSection from '@/components/SolarSystemsSection';
import PartnersSection from '@/components/PartnersSection';
import FunderSection from '@/components/FunderSection';
import ProcessSection from '@/components/ProcessSection';
import { 
  ChevronRight, 
  Sun, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering & Renewable Services | GG Automation Construction Services',
  description:
    'Comprehensive turnkey solar PV EPC, high and low voltage electrical engineering, floating solar, system comparisons, and collaborative engineering partnerships in the Philippines.',
};

export default function ServicesPage() {
  return (
    <div className="bg-[#091833] min-h-screen text-white">
      {/* Page Header Hero Banner */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-20 overflow-hidden border-b border-white/10">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0b7337]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e51a24]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          {/* Breadcrumb Navigation */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">Services</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Engineering & Renewable Services
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turnkey engineering capabilities delivering clean solar photovoltaic power, high-voltage industrial substations, and certified electrical infrastructure across the Philippines.
          </p>

          {/* Quick Pillar Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-sm">
              <Sun className="w-4 h-4" />
              <span>Solar EPC & Rooftop PV</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-amber-400 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              <span>HV/LV Electrical Engineering</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sky-400 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed PRC Engineers & PEC Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Core Services Section (Renewable Energy EPC & Electrical Engineering) */}
      <ServicesSection />

      {/* 2. Solar Power Systems Comparison (On-Grid, Off-Grid, Hybrid, Floating Solar) */}
      <SolarSystemsSection />

      {/* 3. Companies, Collaborators & Partner Hardware Brands */}
      <PartnersSection />

      {/* 4. Financing Partners & Institutional Funders */}
      <FunderSection />

      {/* 5. Process Section (Site Audit -> 3D Simulation -> Turnkey EPC -> DU Interconnection) */}
      <ProcessSection />

      {/* 5. Bottom Consultation Banner */}
      <section className="py-16 bg-gradient-to-b from-[#091833] to-[#060f20] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-emerald-900/40 via-[#0b7337]/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Start Your Clean Energy Transition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto">
              Ready to Design Your Solar or Electrical Project?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Contact our engineering team for a free structural site assessment, load analysis, and customized system design.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-xl hover:shadow-red-950/40 transition-all hover:scale-105"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>Explore Completed Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
