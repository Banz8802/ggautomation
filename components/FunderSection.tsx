'use client';

import React from 'react';
import Image from 'next/image';
import { 
  DollarSign, 
  Globe2, 
  Zap, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Handshake,
  TrendingUp
} from 'lucide-react';

const fundingTiers = [
  {
    range: '1MW – 5MW',
    entity: 'Singaporean Company',
    description: 'International Clean Energy & Industrial Solar PPA Fund',
    icon: <Globe2 className="w-5 h-5 text-sky-400" />,
    badge: 'Cross-Border PPA',
    accentBorder: 'hover:border-sky-400/60',
    accentGlow: 'group-hover:shadow-sky-500/20'
  },
  {
    range: '10MW – 500MW',
    entity: 'European Company',
    description: 'Utility-Scale Renewable Infrastructure & Sovereign Transition Fund',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    badge: 'Utility Scale',
    accentBorder: 'hover:border-emerald-400/60',
    accentGlow: 'group-hover:shadow-emerald-500/20'
  },
  {
    range: '100kWp – 5MW',
    entity: 'Local Funder',
    description: 'Philippine Commercial & Industrial Zero-Capex Solar Financing',
    icon: <Zap className="w-5 h-5 text-[#ffc000]" />,
    badge: 'Local C&I Capital',
    accentBorder: 'hover:border-amber-400/60',
    accentGlow: 'group-hover:shadow-amber-500/20'
  }
];

export default function FunderSection() {
  return (
    <section id="funders" className="relative py-20 sm:py-24 bg-[#091833] text-white overflow-hidden scroll-mt-16 border-t border-b border-white/10">
      {/* Dynamic Background Electric Lightning & Glow Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none"></div>
      
      {/* Atmospheric Energy Blooms */}
      <div className="absolute top-1/2 left-[-150px] -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 right-[-150px] -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#ffc000]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffc000]/15 border border-[#ffc000]/30 text-[#ffc000] text-xs font-black uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ffc000] animate-ping"></span>
            <span>PARTNER</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
            Funder
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-lg mx-auto leading-relaxed">
            Institutional financing partners and Power Purchase Agreement (PPA) providers enabling zero-capex solar transitions.
          </p>

          <div className="w-20 h-1.5 bg-gradient-to-r from-[#ffc000] via-cyan-400 to-[#0b7337] mx-auto rounded-full mt-2"></div>
        </div>

        {/* Main Content Grid: Ditrolic Energy & Confidential Scale Funders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Ditrolic Energy Profile */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-7 sm:p-9 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 relative overflow-hidden group">
              {/* Subtle Corner Glow */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-colors"></div>

              <div className="space-y-6 relative z-10">
                {/* Logo Box */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center justify-center max-w-[280px] shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/ditrolic_energy.webp"
                    alt="Ditrolic Solar Logo"
                    width={240}
                    height={70}
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>

                {/* Subtitle & Tagline */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Net-Zero Committed Company</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    Ditrolic Energy
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  Handling large-size solar leasing and Power Purchase Agreements (PPA). Ditrolic Solar operates headquarters in Malaysia with regional offices in Singapore, deploying clean energy across Southeast Asia.
                </p>

                {/* Features & Key Offerings */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Handshake className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Zero-Capex Solar PPA</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Corporate Solar Leasing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Vertical Divider (Hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="w-px h-80 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"></div>
          </div>

          {/* Right Column: Confidential Institutional Funders */}
          <div className="lg:col-span-6 space-y-5">
            {/* Header / Subtitle */}
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">
                Medium to Large Scale Funder:
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#ffc000] tracking-tight flex items-center gap-2">
                <span>Three (3) Confidential Financing Partners</span>
              </h3>
            </div>

            {/* 3 Capacity Funding Tier Cards */}
            <div className="space-y-3.5">
              {fundingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-xl border border-white/15 ${tier.accentBorder} rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl ${tier.accentGlow} group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}
                >
                  <div className="space-y-1.5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        {tier.icon}
                      </div>
                      <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                        {tier.range}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 pl-11">
                      {tier.description}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 flex-shrink-0 relative z-10">
                    <span className="text-xs sm:text-sm font-bold text-slate-200 bg-white/10 border border-white/15 px-3 py-1 rounded-xl whitespace-nowrap">
                      {tier.entity}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                      {tier.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
