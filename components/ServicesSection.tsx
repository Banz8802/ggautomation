'use client';

import React from 'react';
import { 
  Check, 
  ArrowRight, 
  Sun, 
  Zap, 
  Sparkles, 
  Shield, 
  CheckCircle2, 
  Award,
  Waves
} from 'lucide-react';

const renewableServices = [
  { name: 'Solar PV Systems', highlight: 'Rooftop & Ground' },
  { name: 'Wave Energy', highlight: 'Marine Tech' },
  { name: 'Floating Solar PV', highlight: 'Pioneering EPC' },
  { name: 'Micro-grids & BESS', highlight: 'Island Power' },
  { name: 'Tidal In-stream', highlight: 'Clean Hydro' },
  { name: 'Energy Audit', highlight: 'ISO Standards' },
];

const electricalServices = [
  { name: 'Design and Installation', highlight: 'Full Turnkey' },
  { name: 'Electrical Automation', highlight: 'PLC & SCADA' },
  { name: 'Transformer Banking', highlight: 'High Voltage' },
  { name: 'Consultation & Audit', highlight: 'PRC Certified' },
  { name: 'Lightning Protection', highlight: 'NFPA & PEC' },
  { name: 'General PMS', highlight: 'Preventive Care' },
  { name: 'Generator Set-up & Install', highlight: 'Auto-Sync' },
  { name: 'Equipment Supply', highlight: 'Tier-1 Brands' },
  { name: 'Specialized Works', highlight: 'Custom Engineering' },
];

const credentials = [
  { icon: <Shield className="w-4 h-4 text-[#0b7337]" />, text: 'Licensed PRC Electrical Engineers' },
  { icon: <Zap className="w-4 h-4 text-[#e51a24]" />, text: 'Utility Net-Metering Approved' },
  { icon: <Waves className="w-4 h-4 text-[#091833]" />, text: 'Floating Solar EPC Specialist' },
  { icon: <Award className="w-4 h-4 text-[#ffc000]" />, text: '25-Year Equipment Performance' },
];

interface ServicesSectionProps {
  showHeader?: boolean;
  badge?: string;
  title?: string;
  description?: string;
}

export default function ServicesSection({
  showHeader = false,
  badge = 'SPECIALIZED EXPERTISE',
  title = 'Core Engineering Disciplines',
  description = 'Turnkey engineering capabilities delivering clean renewable power and heavy-duty electrical infrastructure across the Philippines.',
}: ServicesSectionProps) {
  return (
    <section id="services" className="relative py-16 sm:py-20 bg-white text-slate-900 overflow-hidden scroll-mt-16 border-b border-slate-200">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Optional Section Heading */}
        {showHeader && (
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e51a24]/10 border border-[#e51a24]/20 text-[#e51a24] text-xs font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24] animate-ping"></span>
              <span>{badge}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#091833] tracking-tight leading-none">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal max-w-lg mx-auto leading-relaxed">
              {description}
            </p>
            <div className="w-16 h-1 bg-[#e51a24] mx-auto rounded-full mt-2"></div>
          </div>
        )}

        {/* 2 Main Highlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Renewable Energy */}
          <div className="bg-slate-50/90 hover:bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-[#0b7337]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0b7337]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0b7337]/10 transition-colors"></div>

            <div className="space-y-6 relative z-10">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#0b7337]/10 text-[#0b7337] border border-[#0b7337]/20 shadow-sm group-hover:scale-105 transition-transform">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
                        Renewable Energy
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-[#0b7337] uppercase tracking-wider">
                        EPC and Consultation
                      </p>
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#0b7337]/10 border border-[#0b7337]/20 text-[#0b7337] text-[11px] font-bold">
                  6 Core Pillars
                </span>
              </div>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {renewableServices.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-[#0b7337]/30 transition-all shadow-xs group/item"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-[#ffc000]/20 flex items-center justify-center flex-shrink-0 text-amber-600">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 truncate group-hover/item:text-[#0b7337]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap ml-1">
                      {item.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs font-bold relative z-10">
              <span className="text-[#0b7337] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Emission Engineering</span>
              </span>
              <a
                href="/contact"
                className="text-[#091833] hover:text-[#0b7337] inline-flex items-center gap-1.5 transition-colors group/link py-1 px-3 rounded-lg hover:bg-slate-100"
              >
                <span>Consult EPC Team</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0b7337] group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: Electrical Engineering Services */}
          <div className="bg-slate-50/90 hover:bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-[#e51a24]/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e51a24]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#e51a24]/10 transition-colors"></div>

            <div className="space-y-6 relative z-10">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#e51a24]/10 text-[#e51a24] border border-[#e51a24]/20 shadow-sm group-hover:scale-105 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
                        Electrical Engineering
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-[#e51a24] uppercase tracking-wider">
                        High & Low Voltage Services
                      </p>
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#e51a24]/10 border border-[#e51a24]/20 text-[#e51a24] text-[11px] font-bold">
                  9 Disciplines
                </span>
              </div>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {electricalServices.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-red-50/60 border border-slate-200/80 hover:border-[#e51a24]/30 transition-all shadow-xs group/item"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-[#ffc000]/20 flex items-center justify-center flex-shrink-0 text-amber-600">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 truncate group-hover/item:text-[#e51a24]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap ml-1">
                      {item.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs font-bold relative z-10">
              <span className="text-amber-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Heavy Industrial Compliance</span>
              </span>
              <a
                href="/contact"
                className="text-[#091833] hover:text-[#e51a24] inline-flex items-center gap-1.5 transition-colors group/link py-1 px-3 rounded-lg hover:bg-slate-100"
              >
                <span>Inquire Scope</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#e51a24] group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Credentials Strip Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {credentials.map((cred, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#091833] shadow-xs"
            >
              {cred.icon}
              <span>{cred.text}</span>
            </div>
          ))}
        </div>

        {/* Action Callout Bar */}
        <div className="bg-gradient-to-br from-[#091833] to-[#0f2347] text-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-black text-white">
              Planning a Solar or Electrical Engineering Project?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Our registered master electricians and solar engineers provide comprehensive feasibility audits and ROI schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 flex-shrink-0">
            <a
              href="/contact"
              className="px-6 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              ROI Estimator
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg transition-all group"
            >
              <span>Book Site Inspection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}



